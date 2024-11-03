import redisClient from "../redis.js";

const rateLimiter = (secondsLimit, limitAmount) => { 
    return async (req, res, next) => {
        const ip = req.connection.remoteAddress;
        const [response] = await redisClient
            .multi()
            .incr(ip)
            .expire(ip, secondsLimit)
            .exec();
        if (response[1] > limitAmount) 
            res.json({loggedIn: false, status: "Slow down!! Try again in a minute."});
        else next();
    }
}
export default rateLimiter;