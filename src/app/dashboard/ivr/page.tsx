'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack, Input, FormControl, FormLabel, Textarea, Switch, Flex, Text, HStack, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function IVRPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [form, setForm] = useState<any>({ name: '', greeting: '', options: [{ digit: '1', label: 'Sales', destination: '' }, { digit: '2', label: 'Support', destination: '' }], timeout: 10 })
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function load() {
    const res = await fetch('/api/ivr')
    const data = await res.json()
    setMenus(data.menus || [])
  }

  useEffect(() => { load() }, [])

  async function create() {
    setLoading(true)
    try {
      const res = await fetch('/api/ivr', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: 'IVR Menu created', status: 'success' })
      onClose(); load()
    } catch (err: any) { toast({ title: err.message, status: 'error' }) }
    finally { setLoading(false) }
  }

  function updateOption(index: number, field: string, value: string) {
    const opts = [...form.options]
    opts[index] = { ...opts[index], [field]: value }
    setForm({ ...form, options: opts })
  }

  function addOption() {
    const digit = String(form.options.length + 1)
    setForm({ ...form, options: [...form.options, { digit, label: '', destination: '' }] })
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">IVR Menus</Heading>
        <Button colorScheme="primary" onClick={onOpen}>Create IVR</Button>
      </Flex>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr><Th>Name</Th><Th>Options</Th><Th>Timeout</Th><Th>Status</Th><Th>Created</Th></Tr>
          </Thead>
          <Tbody>
            {menus.map(m => {
              const opts = typeof m.options === 'string' ? JSON.parse(m.options) : m.options || []
              return (
                <Tr key={m.id}>
                  <Td fontWeight="medium">{m.name}</Td>
                  <Td><Badge>{opts.length} options</Badge></Td>
                  <Td>{m.timeout}s</Td>
                  <Td><Badge colorScheme={m.enabled ? 'green' : 'gray'}>{m.enabled ? 'Active' : 'Disabled'}</Badge></Td>
                  <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                </Tr>
              )
            })}
            {menus.length === 0 && (
              <Tr><Td colSpan={5} textAlign="center" color="gray.400" py={8}>No IVR menus yet</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay /><ModalContent>
          <ModalHeader>Create IVR Menu</ModalHeader><ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Menu Name</FormLabel>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Main IVR" />
              </FormControl>
              <FormControl>
                <FormLabel>Greeting Message</FormLabel>
                <Textarea value={form.greeting} onChange={e => setForm({...form, greeting: e.target.value})} placeholder="Press 1 for Sales, Press 2 for Support..." />
              </FormControl>
              <FormControl>
                <FormLabel>Timeout (seconds)</FormLabel>
                <NumberInput value={form.timeout} min={3} max={30} onChange={(_, v) => setForm({...form, timeout: v})}>
                  <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Box w="full">
                <Text fontWeight="medium" mb={2}>Menu Options</Text>
                {form.options.map((opt: any, i: number) => (
                  <HStack key={i} mb={2}>
                    <Badge minW="30px" textAlign="center">{opt.digit}</Badge>
                    <Input size="sm" value={opt.label} onChange={e => updateOption(i, 'label', e.target.value)} placeholder="Label" />
                    <Input size="sm" value={opt.destination} onChange={e => updateOption(i, 'destination', e.target.value)} placeholder="+1234567890" />
                  </HStack>
                ))}
                <Button size="sm" variant="outline" onClick={addOption}>+ Add Option</Button>
              </Box>
              <Button colorScheme="primary" w="full" onClick={create} isLoading={loading}>Create IVR Menu</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
