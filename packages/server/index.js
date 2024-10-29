const express = require('express');
const { Server } = require('socket.io')
const helmet = require('helmet')

const app = express();
const server = require("http").createServer(app)

// Attach socket.io server to http server to handle WebSocket connections
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: "true",
    }
});

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
    res.json("hi")
});

io.on("connect", (socket)=> {});

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});
