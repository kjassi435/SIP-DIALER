'use client'

import { Box, Container, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Text, Heading, Flex, Badge } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function DashboardHome() {
  const [stats, setStats] = useState({ numbers: 0, campaigns: 0, callsToday: 0, activeRoutes: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/numbers').then(r => r.json()),
      fetch('/api/campaigns').then(r => r.json()),
      fetch('/api/calls').then(r => r.json()),
      fetch('/api/routes').then(r => r.json()),
    ]).then(([nums, camps, calls, routes]) => {
      setStats({
        numbers: nums.numbers?.length || 0,
        campaigns: camps.campaigns?.length || 0,
        callsToday: calls.calls?.length || 0,
        activeRoutes: routes.routes?.length || 0,
      })
    })
  }, [])

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {[
          { label: 'Phone Numbers', value: stats.numbers, color: 'primary', icon: '📞' },
          { label: 'Campaigns', value: stats.campaigns, color: 'green', icon: '🎯' },
          { label: 'Calls Today', value: stats.callsToday, color: 'blue', icon: '📋' },
          { label: 'Active Routes', value: stats.activeRoutes, color: 'orange', icon: '🔄' },
        ].map((s, i) => (
          <Box key={i} p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
            <Flex align="center" justify="space-between" mb={4}>
              <Text fontSize="2xl">{s.icon}</Text>
              <Badge colorScheme={s.color}>{s.label}</Badge>
            </Flex>
            <Text fontSize="3xl" fontWeight="bold">{s.value}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Recent Activity</Heading>
          <Text color="gray.500">Your dashboard will show recent calls and activity here once you start receiving calls.</Text>
        </Box>
        <Box p={6} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Quick Actions</Heading>
          <Text color="gray.500">Buy a number, create a campaign, or set up call routing from the sidebar menu.</Text>
        </Box>
      </SimpleGrid>
    </Box>
  )
}
