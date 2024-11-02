import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react';
import React from 'react'
import { useColorMode } from '@chakra-ui/react';
import TextField from '../TextField';
import { Form, Formik } from 'formik';
import { friendSchema } from '@chatapp/common';

const AddFriendModal = ({ isOpen, onClose }) => {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton/>
        <Formik
          initialValues={{ friendName: ""}}
          onSubmit={values => {
            onClose();
          }}
          validationSchema={friendSchema}
          >
          <Form>
            <ModalBody>
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
