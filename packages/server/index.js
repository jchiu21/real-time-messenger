import express from 'express';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import authRouter from './routers/authRouter.js';  // Note the .js extension
import { createServer } from 'http';

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

app.use("/auth", authRouter) // For /auth/login and /auth/register

io.on("connect", (socket)=> {});

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});
