'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Input, InputGroup, InputLeftElement, HStack, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/calls').then(r => r.json()).then(d => setCalls(d.calls || []))
  }, [])

  const filtered = calls.filter(c => {
    const matchSearch = c.callerNumber?.includes(search) || c.calledNumber?.includes(search)
    if (filter === 'all') return matchSearch
    if (filter === 'inbound') return matchSearch && c.direction === 'inbound'
    if (filter === 'completed') return matchSearch && c.status === 'completed'
    if (filter === 'blocked') return matchSearch && (c.status?.includes('blocked') || c.voipBlocked)
    return matchSearch
  })

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Call Logs</Heading>

      <HStack mb={6} spacing={4}>
        <InputGroup maxW="300px">
          <InputLeftElement>🔍</InputLeftElement>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by number..." />
        </InputGroup>
        <Select value={filter} onChange={e => setFilter(e.target.value)} maxW="200px">
          <option value="all">All Calls</option>
          <option value="inbound">Inbound</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </Select>
      </HStack>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Caller</Th>
              <Th>Called</Th>
              <Th>Direction</Th>
              <Th>Duration</Th>
              <Th>Status</Th>
              <Th>Tags</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(c => (
              <Tr key={c.id}>
                <Td fontWeight="medium">{c.callerNumber}</Td>
                <Td>{c.calledNumber}</Td>
                <Td><Badge colorScheme={c.direction === 'inbound' ? 'blue' : 'orange'}>{c.direction}</Badge></Td>
                <Td>{c.duration ? `${c.duration}s` : '-'}</Td>
                <Td>
                  <Badge colorScheme={
                    c.status === 'completed' ? 'green' :
                    c.status?.includes('blocked') ? 'red' :
                    c.status === 'ringing' ? 'yellow' : 'gray'
                  }>{c.status}</Badge>
                </Td>
                <Td>{c.tags ? <Badge>{c.tags}</Badge> : '-'}</Td>
                <Td fontSize="sm">{new Date(c.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <Tr><Td colSpan={7} textAlign="center" color="gray.400" py={8}>No calls found</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}
