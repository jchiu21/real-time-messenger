import { useContext, useEffect } from "react"
import socket from "../../socket"
import { AccountContext } from "../AccountContext"

const useSocketSetup = (setFriendList, setMessages) => {
  const { setUser } = useContext(AccountContext); // retrieve setUser
  useEffect(() => {
    if (!socket.connected) 
      console.log("Attempting to connect to socket")
      socket.connect()
      
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Listener for friends event from server, update friend list state
    socket.on("friends", friendList => {
      console.log("Received friendList:", friendList); // Debug log
      setFriendList(friendList)
    })

    socket.on("messages", messages => {
      console.log("Received messages:", messages); // Debug log
      setMessages(messages)
    })

    socket.on("dm", message => {
      console.log("Received messages:", message); // Debug log
      setMessages(prevMsgs => [message, ...prevMsgs]);
    })
    
    socket.on("connected", (status, username) => {
      console.log(`User ${username} connection status changed:`, status); // Debug log
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        })
      })
    })
    // Listen for built-in error event
    socket.on("connect_error", () => {
      setUser({ loggedIn: false })
    })
    // Remove socket listeners when component unmounts
    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friends");
      socket.off("messages");
    }
  }, [setUser, setFriendList, setMessages]);
};

export default useSocketSetup;