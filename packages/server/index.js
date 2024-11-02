import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'socket.io';
import authRouter from './routers/authRouter.js';
import sessionMiddleware, { corsConfig } from "./controllers/serverController.js";

const app = express();
const server = createServer(app); // Create standalone http server that uses express app

// Attach socket.io layer to http server to handle WebSocket connections
const io = new Server(server, {
    cors: corsConfig
});

app.use(helmet()); // Sets HTTP headers for security
app.use(cors(corsConfig));  
app.use(express.json()); // Parse JSON in request body into a JS object
app.use(sessionMiddleware); // Express session middleware
app.use("/auth", authRouter); // For /auth/login and /auth/register

io.use(wrap(sessionMiddleware))
io.on("connect", socket => {
    console.log(socket.request.session.user.username)
});

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});
