'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack, Input, FormControl, FormLabel, Select, Switch, Flex, Text, HStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function RoutingPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [form, setForm] = useState<any>({ name: '', priority: 1, weight: 100, destination: '', destinationType: 'number', campaignId: '', enabled: true })
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function load() {
    const [r, c] = await Promise.all([
      fetch('/api/routes').then(r => r.json()),
      fetch('/api/campaigns').then(r => r.json()),
    ])
    setRoutes(r.routes || [])
    setCampaigns(c.campaigns || [])
  }

  useEffect(() => { load() }, [])

  async function create() {
    setLoading(true)
    try {
      const res = await fetch('/api/routes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: 'Route created', status: 'success' })
      onClose()
      load()
    } catch (err: any) { toast({ title: err.message, status: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Call Routing</Heading>
        <Button colorScheme="primary" onClick={onOpen}>Add Route</Button>
      </Flex>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr><Th>Priority</Th><Th>Weight</Th><Th>Name</Th><Th>Destination</Th><Th>Campaign</Th><Th>Status</Th></Tr>
          </Thead>
          <Tbody>
            {routes.map(r => (
              <Tr key={r.id}>
                <Td>{r.priority}</Td>
                <Td><Badge colorScheme="primary">{r.weight}</Badge></Td>
                <Td>{r.name}</Td>
                <Td>{r.destination}</Td>
                <Td>{r.campaign?.name || '-'}</Td>
                <Td><Badge colorScheme={r.enabled ? 'green' : 'gray'}>{r.enabled ? 'Active' : 'Disabled'}</Badge></Td>
              </Tr>
            ))}
            {routes.length === 0 && (
              <Tr><Td colSpan={6} textAlign="center" color="gray.400" py={8}>No routes configured</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay /><ModalContent>
          <ModalHeader>Add Route</ModalHeader><ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Route Name</FormLabel>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Main Sales Line" />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <NumberInput value={form.priority} min={1} max={100} onChange={(_, v) => setForm({...form, priority: v})}>
                    <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Weight</FormLabel>
                  <NumberInput value={form.weight} min={1} max={1000} onChange={(_, v) => setForm({...form, weight: v})}>
                    <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Destination Number</FormLabel>
                <Input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="+1234567890" />
              </FormControl>
              <FormControl>
                <FormLabel>Campaign (optional)</FormLabel>
                <Select value={form.campaignId} onChange={e => setForm({...form, campaignId: e.target.value})} placeholder="All campaigns">
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Enabled</FormLabel>
                <Switch isChecked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} />
              </FormControl>
              <Button colorScheme="primary" w="full" onClick={create} isLoading={loading}>Create Route</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
