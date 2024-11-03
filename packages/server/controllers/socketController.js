const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        console.log("Bad socket request!")
        next(new Error("Not authorized"))
    } else {
        next();
    }
}

export default authorizeUser;