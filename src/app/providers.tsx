'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    primary: {
      50: '#f9f6fd', 100: '#e5daf8', 200: '#d3bef4', 300: '#b795ec',
      400: '#a379e7', 500: '#8952e0', 600: '#7434db', 700: '#6023c0',
      800: '#4f1d9e', 900: '#3b1676',
    },
    secondary: {
      50: '#f4fbfd', 100: '#d0eef7', 200: '#bae7f3', 300: '#a2deee',
      400: '#53c2e1', 500: '#2ab4d9', 600: '#24a2c4', 700: '#1e86a2',
      800: '#196e85', 900: '#135567',
    },
  },
  fonts: {
    heading: 'Inter Variable, Inter, sans-serif',
    body: 'Inter Variable, Inter, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme} cssVarsRoot="body">
      {children}
    </ChakraProvider>
  )
}
