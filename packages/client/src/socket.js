import {io} from "socket.io-client"

const socket = new io("http://localhost:4000", {
    autoConnect: false, // dont connect to backend if user not logged in
    withCredentials: true, // send cookies with initial socket connection
    
});

export default socket;