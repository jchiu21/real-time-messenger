import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'socket.io';
import authRouter from './routers/authRouter.js';
import { corsConfig, sessionMiddleware, wrap } from "./controllers/serverController.js";
import authorizeUser from "./controllers/socketController.js";

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

// SocketIO middleware runs (in order) when connection comes through
io.use(wrap(sessionMiddleware)) // Share session middleware with express
io.use(authorizeUser) //
io.on("connect", socket => {
    console.log(socket.id)
    console.log(socket.request.session.user.username)
});

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});
