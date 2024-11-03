import redisClient from "../redis.js"

const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        console.log("Bad socket request!")
        next(new Error("Not authorized"))
    } else {
        socket.user = {...socket.request.session.user}
        redisClient.hset(
            `userid:${socket.user.username}`, // Redis key
            "userid", // User id field
            socket.user.userid
        )
        next();
    }
}

export default authorizeUser;