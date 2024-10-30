import { 
    Button, 
    ButtonGroup, 
    Heading,
    VStack    
} from "@chakra-ui/react"
import { Form, Formik } from "formik";
import * as Yup from "yup"
import { useColorMode } from "@chakra-ui/react";
import TextField from "./TextField";
import { useNavigate } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";

const SignUp = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    const navigate = useNavigate();
    return (
    <Formik
        initialValues={{username: "", password: ""}}
        validationSchema={Yup.object({
        username: Yup.string()
                .required("Username required!")
                .min(6, "Username too short!")
                .max(28, "Username too long!"),
        password: Yup.string()
                .required("Password required!")
                .min(6, "Password too short!")
                .max(28, "Password too long!"),
        })}
        onSubmit={(values, actions) => {
            const vals = {...values}
            actions.resetForm()
            // Make HTTP POST request to localhost:4000
            fetch("https:/localhost:4000", {
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
                console.log(data)
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
            <Heading>Sign Up</Heading>
            
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
            />

            <ButtonGroup pt="1rem">
                <Button 
                    colorScheme="teal" 
                    type="submit"
                    color={colorMode === "dark" ? "black" : "white"}
                >
                    Create Account
                </Button>
                <Button 
                    _hover = {colorMode === "dark" ? "gray.800" : "white"}
                    bg={colorMode === "dark" ? "gray.700" : "gray.200"}
                    onClick={()=>navigate("/")}
                    leftIcon={<ArrowBackIcon />}
                >
                        Back
                </Button>
            </ButtonGroup>
        </VStack>                
    </Formik>)
}

export default SignUp

