const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter")

const app = express();
const server = require("http").createServer(app);

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
