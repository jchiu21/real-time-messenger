import { AddIcon, ChatIcon } from '@chakra-ui/icons'
import { Button, Circle, Divider, Heading, HStack, Tab, TabList, Text, useDisclosure, VStack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { FriendContext } from './Home'
import AddFriendModal from './AddFriendModal'

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const { friendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <VStack>
        <HStack justify="center" w="100%" py="1rem">
          <Heading size="md">Add Friend</Heading>
          <Button           
            onClick={onOpen}
            _hover={colorMode === "dark" ? "gray.800" : "white"}
            bg={colorMode === "dark" ? "gray.700" : "gray.200"}
            _focus={{boxShadow: "none"}}
            boxSize="40px"
          >
            <AddIcon h="10px" w="10px"/>
          </Button>
        </HStack>
        
        <Divider />
        
        <VStack as={TabList} borderBottom="0px">
            {friendList.map(friend => (
            <HStack as={Tab} key={`friend:${friend}`}_focus={{boxShadow: "none"}}>
              <Circle 
                bg={friend.connected ? "green.700" : "red.500"} 
                w="15px" h="15px" 
              />
              <Text fontSize="larger">{friend}</Text> 
            </HStack>
          ))}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Sidebar
