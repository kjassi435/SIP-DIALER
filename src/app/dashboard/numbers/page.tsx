'use client'

import { Box, Container, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack, Input, FormControl, FormLabel, Select, Text, HStack, Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Alert, AlertIcon, AlertDescription, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<any[]>([])
  const [twilioAvailable, setTwilioAvailable] = useState<any[]>([])
  const [twilioAreaCode, setTwilioAreaCode] = useState('')
  const [selectedTwilioNumber, setSelectedTwilioNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [twilioLoading, setTwilioLoading] = useState(false)
  const [manualNumber, setManualNumber] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function loadNumbers() {
    const res = await fetch('/api/numbers')
    const data = await res.json()
    setNumbers(data.numbers || [])
  }

  useEffect(() => { loadNumbers() }, [])

  async function searchTwilio() {
    setTwilioLoading(true)
    try {
      const res = await fetch(`/api/twilio/available?areaCode=${twilioAreaCode}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTwilioAvailable(data.numbers || [])
      if (data.numbers?.length === 0) {
        toast({ title: 'No numbers found for this area code', status: 'info' })
      }
    } catch (err: any) {
      toast({ title: err.message || 'Failed to search Twilio numbers', status: 'error', duration: 5000 })
    } finally { setTwilioLoading(false) }
  }

  async function buyTwilioNumber() {
    if (!selectedTwilioNumber) return
    setLoading(true)
    try {
      const res = await fetch('/api/twilio/numbers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: selectedTwilioNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: `Number ${data.number.number} purchased from Twilio!`, status: 'success', duration: 5000 })
      onClose()
      setSelectedTwilioNumber('')
      setTwilioAvailable([])
      loadNumbers()
    } catch (err: any) {
      toast({ title: err.message || 'Failed to purchase number', status: 'error', duration: 6000 })
    } finally { setLoading(false) }
  }

  async function addManualNumber() {
    if (!manualNumber) return
    setLoading(true)
    try {
      const res = await fetch('/api/numbers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: manualNumber, manual: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: `Number ${data.number.number} added!`, status: 'success' })
      onClose()
      setManualNumber('')
      loadNumbers()
    } catch (err: any) {
      toast({ title: err.message, status: 'error' })
    } finally { setLoading(false) }
  }

  async function deleteNumber(id: string) {
    if (!confirm('Remove this number?')) return
    const n = numbers.find(x => x.id === id)
    if (n?.telnyxId?.startsWith('tw_') && n.telnyxId.length > 3) {
      const sid = n.telnyxId.replace('tw_', '')
      await fetch('/api/twilio/numbers', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid }),
      })
    } else {
      await fetch(`/api/numbers/${id}`, { method: 'DELETE' })
    }
    toast({ title: 'Number removed', status: 'info' })
    loadNumbers()
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Phone Numbers</Heading>
        <Button colorScheme="primary" onClick={onOpen}>Add Number</Button>
      </Flex>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Number</Th>
              <Th>Campaign</Th>
              <Th>Provider</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {numbers.length === 0 && (
              <Tr><Td colSpan={6} textAlign="center" color="gray.400" py={8}>No numbers yet. Click "Add Number" to get a free Twilio number!</Td></Tr>
            )}
            {numbers.map(n => (
              <Tr key={n.id}>
                <Td fontWeight="medium">{n.number}</Td>
                <Td>{n.campaign?.name || <Badge variant="outline">Unassigned</Badge>}</Td>
                <Td>
                  <Badge colorScheme={n.telnyxId?.startsWith('tw_') ? 'red' : n.telnyxId?.startsWith('manual_') ? 'gray' : 'purple'} fontSize="xs">
                    {n.telnyxId?.startsWith('tw_') ? 'Twilio' : n.telnyxId?.startsWith('manual_') ? 'Manual' : 'Telnyx'}
                  </Badge>
                </Td>
                <Td><Badge colorScheme={n.status === 'active' ? 'green' : 'red'}>{n.status}</Badge></Td>
                <Td>{new Date(n.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Button size="xs" colorScheme="red" variant="ghost" onClick={() => deleteNumber(n.id)}>Remove</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Phone Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Twilio (Free)</Tab>
                <Tab>Add Manually</Tab>
                <Tab>Telnyx</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <Alert status="success" borderRadius="lg" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      Twilio gives you a <strong>free real phone number</strong> with your $15 trial credit. Search below and buy one instantly!
                    </AlertDescription>
                  </Alert>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Area Code (optional)</FormLabel>
                      <HStack>
                        <Input value={twilioAreaCode} onChange={e => setTwilioAreaCode(e.target.value)} placeholder="e.g. 415" maxLength={3} />
                        <Button onClick={searchTwilio} isLoading={twilioLoading}>Search</Button>
                      </HStack>
                    </FormControl>
                    {twilioAvailable.length > 0 && (
                      <FormControl>
                        <FormLabel>Select a number</FormLabel>
                        <Select value={selectedTwilioNumber} onChange={e => setSelectedTwilioNumber(e.target.value)} placeholder="Choose...">
                          {twilioAvailable.map((n: any) => (
                            <option key={n.phoneNumber} value={n.phoneNumber}>
                              {n.phoneNumber} - {n.locality || 'N/A'}, {n.region || 'US'}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Button colorScheme="red" w="full" onClick={buyTwilioNumber} isLoading={loading} isDisabled={!selectedTwilioNumber}>
                      Buy with Twilio (Free Trial)
                    </Button>
                    <Text fontSize="xs" color="gray.400">Twilio trial includes ~$15 credit. Numbers are ~$1/mo.</Text>
                  </VStack>
                </TabPanel>
                <TabPanel px={0}>
                  <Alert status="info" borderRadius="lg" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      Add any phone number you already have. Won't actually receive calls — just for testing the dashboard UI.
                    </AlertDescription>
                  </Alert>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Phone Number (E.164)</FormLabel>
                      <Input value={manualNumber} onChange={e => setManualNumber(e.target.value)} placeholder="+1234567890" />
                    </FormControl>
                    <Button colorScheme="primary" w="full" onClick={addManualNumber} isLoading={loading} isDisabled={!manualNumber}>
                      Add Number
                    </Button>
                  </VStack>
                </TabPanel>
                <TabPanel px={0}>
                  <Alert status="warning" borderRadius="lg" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      Telnyx trial accounts cannot purchase numbers. Upgrade at telnyx.com/upgrade to use Telnyx. Use Twilio tab instead (free on trial).
                    </AlertDescription>
                  </Alert>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
