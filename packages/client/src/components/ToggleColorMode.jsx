import { Button } from "@chakra-ui/button"
import { useColorMode } from "@chakra-ui/color-mode"
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ToggleColorMode = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    return (
        <Button 
            onClick={() => toggleColorMode()} 
            pos="absolute" 
            top="0" 
            right="0" 
            m="1rem"
            bg={colorMode === "dark" ? "gray.800" : "white"}
            _hover = {colorMode === "dark" ? "gray.800" : "white"}
            _focus={{boxShadow: "none"}}
        >
            {colorMode === "dark" ? <SunIcon/> : <MoonIcon/>}
        </Button>
    )
}

export default ToggleColorMode;