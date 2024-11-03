import { Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react';
import React from 'react'
import { useColorMode } from '@chakra-ui/react';
import TextField from '../TextField';
import { Form, Formik } from 'formik';
import { friendSchema } from '@chatapp/common';
import socket from "../../socket.js" // Socket client instance
import { useState } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { FriendContext } from './Home.jsx';

const AddFriendModal = ({ isOpen, onClose }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [ error, setError ] = useState("");
  // Use useCallback so a new instance of setError and onClose is not created every re-render 
  const closeModal = useCallback(
    () => {
      setError("");
      onClose();
    },
    [onClose],
  )
  const {setFriendList} = useContext(FriendContext);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton/>
        <Formik
          initialValues={{ friendName: ""}} // Initialize add friend form with friendName field
          onSubmit={values => { // Pass form values into onSubmit callback
            socket.emit( // .emit() sends an event to IO server through WebSocket
              "add_friend", // Name of the event
              values.friendName, // Data that is sent along with event
              ({errorMsg, done}) => { // Pass callback to the server side
                if (done) {
                  setFriendList(c => [values.friendName, ...c]) // Add friend to list
                  closeModal(); // Close the modal, clear error messages
                  return;
                }
                setError(errorMsg)
              }
            );
          }}
          validationSchema={friendSchema}
          >
          <Form>
            <ModalBody>
              <Heading 
                color="red.500" 
                textAlign="center"
                fontSize="l"
              >
                {error}
              </Heading>
              <TextField 
                label="Friend's name"
                placeholder="Enter friend's username.."
                autocomplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default AddFriendModal;
