import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'socket.io';
import authRouter from './routers/authRouter.js';
import { corsConfig, sessionMiddleware, wrap } from "./controllers/serverController.js";
import { authorizeUser, addFriend, initializeUser } from "./controllers/socketController.js";

const app = express();
const server = createServer(app); // Create standalone http server that uses express app

// Attach socket.io layer to http server to handle WebSocket connections
const io = new Server(server, {
    cors: corsConfig
});

app.use(helmet()); // Sets HTTP headers for security
app.use(cors(corsConfig));  
app.use(express.json()); // Parse JSON in request body into a JS object
app.use(sessionMiddleware); // Use session middleware for http requests
app.use("/auth", authRouter); // For /auth/login and /auth/register

io.use(wrap(sessionMiddleware)); // Share session middleware with express
io.use(authorizeUser); 
io.on("connect", socket => {
    initializeUser(socket);
    // Define event listener for add_friend event
    // Use inner callback to pass socket instance to function
    socket.on("add_friend", (friendName, cb) => {
        addFriend(socket, friendName, cb)
    }); 
});

server.listen(4000, () => {
    console.log("Server listening on port 4000");
});
