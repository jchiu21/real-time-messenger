import { Button, HStack, Input } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useContext } from 'react'
import * as Yup from "yup"
import { MessagesContext } from './Home'
import socket from '../../socket'

const ChatBox = ({userid}) => {
  const {setMessages} = useContext(MessagesContext);
  return (
    <Formik 
      initialValues={{message: ""}}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255) 
      })}
      onSubmit={(values, actions) => {
        const message = {to: userid, from: null, content: values.message}
        socket.emit("dm", message);
        console.log(message)
        setMessages(prevMsgs => [message, ...prevMsgs])
        actions.resetForm();
      }}
      >
        <HStack as={Form} w="100%" pb="1.2rem" px="1.2rem">
          <Input 
            as={Field} 
            name="message" 
            placeholder="Type message here"
            size="lg" 
            autoComplete="off"
          />
          <Button type="submit" size="lg" colorScheme="teal">
            Send
          </Button>
        </HStack>
    </Formik>
  )
}

export default ChatBox
