import { Routes, Route } from "react-router-dom"
import SignUp from "./login/SignUp";
import Login from "./login/Login";
import React, { useContext } from "react";
import { Text } from "@chakra-ui/react";
import PrivateRoutes from "./PrivateRoutes";
import { AccountContext } from "./AccountContext";
import Home from "./Home/Home";

const Views = () => {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<Login/ >}/>
      <Route path="/register" element={<SignUp />}/>
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Login />}/>
    </Routes>
  );   
}

export default Views
