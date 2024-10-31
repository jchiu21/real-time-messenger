import { Routes, Route } from "react-router-dom"
import SignUp from "./login/SignUp";
import Login from "./login/Login";
import React from "react";

const Views = () => {
    return (
        <Routes>
            <Route path="/" element={<Login/ >}/>
            <Route path="/register" element={<SignUp />}/>
            <Route path="*" element={<Login />}/>
        </Routes>
    );
}

export default Views
