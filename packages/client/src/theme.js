import { extendTheme } from "@chakra-ui/react"

// Define theme object for app
const theme = {
    config: {
        initialColorMode: "dark",
        useSystemColorMode: true,
    },
    styles: {
        global: {
            body: {
                margin: 0,
                "fontFamily":
                    "font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
                "WebkitFontSmoothing: antialiased": "antialiased",
                "MozOsxFontSmoothing": "grayscale",
            },

            code: {
                "fontFamily":
                    "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
            }
        }
    }
}

export default extendTheme(theme);