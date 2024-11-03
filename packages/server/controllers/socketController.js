import redisClient from "../redis.js"

const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        console.log("Bad socket request!")
        next(new Error("Not authorized"))
    } else {
        next();
    }
}

const initializeUser = async (socket) => {
    socket.user = {...socket.request.session.user}
    socket.join(socket.user.userid) // Assigns user to a room based on userid
    redisClient.hset(
        `userid:${socket.user.username}`, // Redis key
        "userid", // Field name
        socket.user.userid, // Field value
        "connected",
        true
    );
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0, -1);
    const parsedFriendList = await parseFriendList(friendList); // Need parsed list to send to frontend
    const friendRooms = parsedFriendList.map(friend => friend.userid);
    // Emit false connected status to all friends
    if (friendRooms.length > 0) 
        socket.to(friendRooms).emit("connected", true, socket.user.username)
    
    console.log(`${socket.user.username} friends:`, parsedFriendList);
    socket.emit("friends", parsedFriendList) // Send friend array to frontend through friend event
}

// Callback function defined in socket.emit() in AddFriendModal
const addFriend = async (socket, friendName, cb) => {
    // If we try to add ourselves as friend
    if (friendName === socket.user.username) {
        console.log("Cannot add self");
        cb({done: false, errorMsg: "Cannot add self!"});
        return; 
    }
    // Get current user's friend list
    const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.username}`, // Redis key
        0, -1 // Get the entire stack 
    );
    // Get friend using friendName field in AddFriendModal form
    const friend = await redisClient.hgetall(
        `userid:${friendName}`, // Redis key
    )
    // If user not found (empty arrays are still truthy)
    if (!friend.userid) {
        cb({done: false, errorMsg: "User doesn't exist!"});
        return;
    }
    // if user already in friend list
    if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
        cb({done: false, errorMsg: "Friend already added!"});
        return;
    }
    // Add user to friend list (don't store connected status in list; too much overhead)
    await redisClient.lpush(`friends:${socket.user.username}`, [
        friendName, 
        friend.userid
    ].join(".")); // Store as a string
    const newFriend = {
        username: friendName,
        userid: friend.userid,
        connected: friend.connected
    }
    cb({ done: true, newFriend });
}

const onDisconnect = async (socket) => {
    await redisClient.hset(`userid:${socket.user.username}`,
        "connected",
        false
    )
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`, 
        0, -1);
    // Get array of user id's from current friend list
    const friendRooms = await parseFriendList(friendList)
        .then(friends => friends.map(friend => friend.userid));
    // Emit false connected status to all friends
    socket.to(friendRooms).emit("connected", false, socket.user.username)
}
// turn friendName.userid into {username: friendName, userid: userid, connected: bool}
const parseFriendList = async (friendList) => {
    const newFriendList = [];
    for (let friend of friendList) {
        const parsedFriend = friend.split(".")
        // Get value of friend's connected status
        const friendConnected = await redisClient.hget(
            `userid:${parsedFriend[0]}`, 
            "connected"
        );
        newFriendList.push({
            username: parsedFriend[0], 
            userid: parsedFriend[1], 
            connected: friendConnected
        })
    }
    return newFriendList;
}

export { authorizeUser, initializeUser, addFriend, onDisconnect };