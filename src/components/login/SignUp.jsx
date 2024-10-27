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
          alert(JSON.stringify(values, null, 2));
          actions.resetForm()
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

