import { 
    Button, 
    ButtonGroup, 
    Heading,
    Text,
    VStack    
} from "@chakra-ui/react"
import { Form, Formik } from "formik";
import { formSchema } from "@chatapp/common";
import { useColorMode } from "@chakra-ui/react";
import TextField from "../TextField";
import { useNavigate } from "react-router";
import React, { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";

const Login = () => {
    const {setUser} = useContext(AccountContext);
    const [error, setError] = useState(null);
    const {colorMode, toggleColorMode} = useColorMode();
    const navigate = useNavigate();
    return (
    <Formik
        initialValues={{username: "", password: ""}}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
            const vals = {...values}
            actions.resetForm()
            // Make HTTP POST request to backend endpoint
            fetch("http://localhost:4000/auth/login", {
                method: "POST",
                credentials: "include", // Cookes and HTTP auth headers sent with req
                headers: {
                    "Content-Type": "application/json", // Body contains JSON data
                },
                body: JSON.stringify(vals) // JS object -> JSON string
            })
            .catch(err => {
                return;
            })
            .then(res => {
                if (!res || !res.ok || res.status >= 400) return
                return res.json() // JSON string -> JS object for next .then() call
            })
            .then(data => {
                if (!data) return;
                setUser({...data})
                if (data.status) {
                    setError(data.status)
                } else if (data.loggedIn) {
                    navigate("/home")
                }
            })
        }}
    >
        <VStack 
            as={Form}
            w={{base: "90%", md: "500px"}} 
            m="auto"
            justify="center" 
            h="100vh"
            spacing="1rem"
        >
            <Heading>Log In</Heading>

            <Text as="p" color="red.500">
                {error}
            </Text>

            <TextField 
                name="username" 
                placeholder="Enter username" 
                autoComplete="off"
                label="Username"
            />
            <TextField 
                name="password"
                placeholder="Enter password"
                autoComplete="off"
                label="Password"
                type="password"
            />
                
            <ButtonGroup pt="1rem">
                <Button 
                    colorScheme="teal" 
                    type="submit"
                    color={colorMode === "dark" ? "black" : "white"}
                >
                    Log In
                </Button>
                <Button 
                    _hover = {colorMode === "dark" ? "gray.800" : "white"}
                    bg={colorMode === "dark" ? "gray.700" : "gray.200"}
                    onClick={()=> navigate("/register")}
                >
                    Create Account
                </Button>
            </ButtonGroup>
        </VStack>        
    </Formik>)
}

export default Login
