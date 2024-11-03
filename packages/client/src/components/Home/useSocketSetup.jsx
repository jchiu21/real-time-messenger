import { useContext, useEffect } from "react"
import socket from "../../socket"
import { AccountContext } from "../AccountContext"

const useSocketSetup = (setFriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", friendList => {
      setFriendList(friendList)
    })
    // listen for connected status 
    socket.on("connected", (status, username) => {
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        })
      })
    })
    socket.on("connect_error", () => {
      setUser({loggedIn: false})
    })
    return () => {
      socket.off("connect_error")
    }
  }, [setUser]);
};

export default useSocketSetup;