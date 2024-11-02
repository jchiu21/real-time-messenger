import { ChatIcon } from '@chakra-ui/icons'
import { Button, Circle, Divider, Heading, HStack, Tab, TabList, Text, VStack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { FriendContext } from './Home'
import AddFriendModal from './AddFriendModal'

const Sidebar = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const { friendList, setFriendList } = useContext(FriendContext);
  return (
    <>
      <VStack py="1rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button           
            _hover={colorMode === "dark" ? "gray.800" : "white"}
            bg={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <ChatIcon />
          </Button>
        </HStack>
        
        <Divider />
        
        <VStack as={TabList}>
            {friendList.map(friend => (
            <HStack as={Tab}>
              <Circle 
                bg={friend.connected ? "green.700" : "red.500"} 
                w="15px" h="15px" 
              />
              <Text>{friend.username}</Text> 
            </HStack>
          ))}
        </VStack>
      </VStack>
      <AddFriendModal />
    </>
  );
}

export default Sidebar
