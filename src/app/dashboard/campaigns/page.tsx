'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack, Input, FormControl, FormLabel, Flex, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function load() {
    const res = await fetch('/api/campaigns')
    const data = await res.json()
    setCampaigns(data.campaigns || [])
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!name) return
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: 'Campaign created', status: 'success' })
      setName('')
      onClose()
      load()
    } catch (err: any) { toast({ title: err.message, status: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Campaigns</Heading>
        <Button colorScheme="primary" onClick={onOpen}>New Campaign</Button>
      </Flex>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr><Th>Name</Th><Th>Numbers</Th><Th>Routes</Th><Th>Status</Th><Th>Created</Th></Tr>
          </Thead>
          <Tbody>
            {campaigns.map(c => (
              <Tr key={c.id}>
                <Td fontWeight="medium">{c.name}</Td>
                <Td><Badge>{c.phoneNumbers?.length || 0}</Badge></Td>
                <Td><Badge colorScheme="blue">{c.callRoutes?.length || 0}</Badge></Td>
                <Td><Badge colorScheme={c.status === 'active' ? 'green' : 'gray'}>{c.status}</Badge></Td>
                <Td>{new Date(c.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {campaigns.length === 0 && (
              <Tr><Td colSpan={5} textAlign="center" color="gray.400" py={8}>No campaigns yet</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay /><ModalContent>
          <ModalHeader>Create Campaign</ModalHeader><ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Google Ads - Summer Sale" />
              </FormControl>
              <Button colorScheme="primary" w="full" onClick={create} isLoading={loading}>Create</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
