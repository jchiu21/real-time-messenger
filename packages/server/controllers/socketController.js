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
    redisClient.hset(
        `userid:${socket.user.username}`, // Redis key
        "userid", // Field name
        socket.user.userid // Field value
    );
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0, -1);
    console.log(friendList);
    socket.emit("friends", friendList) // Send friend array to frontend through friend event
    console.log("USERID: ", socket.user.userid, "/ Username: ", socket.request.session.user.username);
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
    // Get friend user ID using friendName field in AddFriendModal form
    const friendUserID = await redisClient.hget(
        `userid:${friendName}`, // Redis key
        "userid" // Field name
    )
    // If user not found
    if (!friendUserID) {
        cb({done: false, errorMsg: "User doesn't exist!"});
        return;
    }
    // if user already in friend list
    if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
        cb({done: false, errorMsg: "Friend already added!"});
        return;
    }
    // Add user to friend list
    await redisClient.lpush(`friends:${socket.user.username}`, friendName);
    cb({ done: true});
}

export { authorizeUser, initializeUser, addFriend };