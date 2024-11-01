import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'socket.io';
import session from 'express-session';

import authRouter from './routers/authRouter.js';

const app = express();
const server = createServer(app);

// Attach socket.io server to http server to handle WebSocket connections
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: "true",
    }
});

app.use(helmet()); // Sets HTTP headers for security

app.use(cors({
    origin: "http://localhost:5173", // Only allows requests from localhost:5173
    credentials: true // Allows requests with credentials (cookies)
}));  

app.use(express.json());
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        credentials: true,
        name: "sid", 
        resave: false, // Don't resave unchanged sessions to storage
        saveUninitialized: false, // Prevents new sessions from being saved if empty
        cookie: {
            secure: process.env.ENVIRONMENT === "production", // Only send cookie over HTTPS in production
            httpOnly: true, // Cookie cannot be accessed via JS in client
            sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax", // Allow cross-cross site requests in production
            expires: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.use("/auth", authRouter); // For /auth/login and /auth/register

io.on("connect", (socket)=> {});

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});
