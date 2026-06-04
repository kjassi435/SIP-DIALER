'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Button, VStack, Input, FormControl, FormLabel, useToast, HStack, Code, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function SIPAccountsPage() {
  const [numbers, setNumbers] = useState<any[]>([])
  const [newSipUser, setNewSipUser] = useState('')
  const [newSipPass, setNewSipPass] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetch('/api/numbers').then(r => r.json()).then(d => setNumbers(d.numbers || []))
  }, [])

  function generateSipCredentials() {
    const user = `sip_${Math.random().toString(36).substring(2, 10)}`
    const pass = Math.random().toString(36).substring(2, 14)
    setNewSipUser(user)
    setNewSipPass(pass)
  }

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>SIP Accounts</Heading>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" p={6} mb={8}>
        <Heading size="sm" mb={4}>Create SIP Credential</Heading>
        <Text color="gray.500" mb={4} fontSize="sm">Generate SIP credentials to register your softphone or PBX with our platform.</Text>
        <VStack align="flex-start" spacing={3}>
          <Button colorScheme="primary" onClick={generateSipCredentials}>Generate Credentials</Button>
          {newSipUser && (
            <Box bg="gray.50" p={4} borderRadius="lg" w="full">
              <Text fontWeight="bold" mb={2}>Your SIP Account</Text>
              <VStack align="flex-start" spacing={1}>
                <HStack><Text fontSize="sm" color="gray.500">Username:</Text><Code>{newSipUser}</Code></HStack>
                <HStack><Text fontSize="sm" color="gray.500">Password:</Text><Code>{newSipPass}</Code></HStack>
                <HStack><Text fontSize="sm" color="gray.500">Server:</Text><Code>sip.yourdomain.com:5060</Code></HStack>
              </VStack>
              <Text fontSize="xs" color="orange.500" mt={2}>⚠ Save these! Password won't be shown again.</Text>
            </Box>
          )}
        </VStack>
      </Box>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Heading size="sm" p={4} borderBottom="1px" borderColor="gray.100">Your Numbers (SIP endpoints)</Heading>
        <Table>
          <Thead bg="gray.50">
            <Tr><Th>Number</Th><Th>SIP URI</Th><Th>Status</Th></Tr>
          </Thead>
          <Tbody>
            {numbers.map(n => (
              <Tr key={n.id}>
                <Td fontWeight="medium">{n.number}</Td>
                <Td><Code fontSize="xs">{n.number.replace('+', '')}@sip.yourdomain.com</Code></Td>
                <Td><Badge colorScheme="green">Active</Badge></Td>
              </Tr>
            ))}
            {numbers.length === 0 && (
              <Tr><Td colSpan={3} textAlign="center" color="gray.400" py={8}>Buy a number first to see SIP endpoints</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}
