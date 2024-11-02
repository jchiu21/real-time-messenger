import RedisStore from "connect-redis";
import redisClient from "../redis";
import session from "express-session";

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new RedisStore({client: redisClient}), 
    resave: false, // Don't resave unchanged sessions to storage
    saveUninitialized: false, // Prevents new sessions from being saved if empty
    cookie: {
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        httpOnly: true, // Cookie cannot be accessed via JS in client
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-cross site requests in production
        expires: 1000 * 60 * 60 * 24 * 7
    }
})

// Returns a socketIO compatible version of expressMiddleware because socketIO uses (socket, next) arguments for middleware 
const wrap = (expressMiddleware) => (socket, next) => 
    expressMiddleware(socket.request, {}, next)

const corsConfig = {
    origin: "http://localhost:5173", // Only allows requests from localhost:5173
    credentials: true // Allows requests with credentials (cookies)
}

export {sessionMiddleware, wrap, corsConfig }

