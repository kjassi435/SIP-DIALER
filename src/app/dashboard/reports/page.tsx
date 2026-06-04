'use client'

import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Text, Flex, Badge, Select, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function ReportsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [period, setPeriod] = useState('7d')

  useEffect(() => {
    fetch('/api/calls').then(r => r.json()).then(d => setCalls(d.calls || []))
  }, [])

  const totalCalls = calls.length
  const completedCalls = calls.filter(c => c.status === 'completed').length
  const blockedCalls = calls.filter(c => c.status?.includes('blocked') || c.voipBlocked).length
  const avgDuration = calls.length ? Math.round(calls.reduce((s, c) => s + (c.duration || 0), 0) / calls.length) : 0

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Reports & Analytics</Heading>
        <Select value={period} onChange={e => setPeriod(e.target.value)} maxW="200px">
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Text color="gray.500" mb={1}>Total Calls</Text>
          <Text fontSize="3xl" fontWeight="bold">{totalCalls}</Text>
        </Box>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Text color="gray.500" mb={1}>Completed</Text>
          <Text fontSize="3xl" fontWeight="bold" color="green.500">{completedCalls}</Text>
        </Box>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Text color="gray.500" mb={1}>Blocked</Text>
          <Text fontSize="3xl" fontWeight="bold" color="red.500">{blockedCalls}</Text>
        </Box>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Text color="gray.500" mb={1}>Avg Duration</Text>
          <Text fontSize="3xl" fontWeight="bold">{avgDuration}s</Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Call Status Breakdown</Heading>
          <Text>Detailed analytics with charts coming soon. Data is being collected from Telnyx webhooks.</Text>
        </Box>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Campaign Performance</Heading>
          <Text>Campaign-level analytics will appear here once you have call data.</Text>
        </Box>
      </SimpleGrid>
    </Box>
  )
}
