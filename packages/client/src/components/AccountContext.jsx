import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router";

export const AccountContext = createContext();

const UserContext = ({children}) => {
  const [user, setUser] = useState({loggedIn: null});
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4000/auth/login", {
      credentials: "include",
    }).catch(err => {
      setUser({ loggedIn: false});
      return;
    }).then(r => {
      if (!r || !r || r.status >= 400) {
        setUser({ loggedIn: false});
        return;
      }
      return r.json()
    }).then(data => {
      if (!data) {
        setUser({ loggedIn: false});
        return;
      }
      navigate("/home")
      setUser({...data})
    });
  }, []);
  
  return <AccountContext.Provider value={{ user, setUser }}>
    {children}
  </AccountContext.Provider>
}

export default UserContext;