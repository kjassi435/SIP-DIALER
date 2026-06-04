'use client'

import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, useToast, Text, Divider, Code, Badge, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { PLANS } from '@/lib/plans'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [user, setUser] = useState<any>(null)
  const toast = useToast()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) {
        setUser(d.user)
        setName(d.user.name || '')
      }
    })
  }, [])

  const plan = PLANS[user?.plan as keyof typeof PLANS]

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Settings</Heading>

      <VStack align="stretch" spacing={8} maxW="600px">
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Your Plan</Heading>
          <HStack mb={3}>
            <Badge colorScheme={user?.plan === 'PREMIUM' ? 'yellow' : user?.plan === 'BASIC' ? 'cyan' : 'gray'} fontSize="md" px={3} py={1}>
              {plan?.name || 'Free'}
            </Badge>
            <Text fontSize="sm" color="gray.500">${plan?.price || 0}/mo</Text>
          </HStack>
          <Text fontSize="sm" color="gray.500" mb={3}>
            {plan?.maxNumbers === Infinity ? 'Unlimited' : plan?.maxNumbers} phone numbers • {plan?.callRecording ? 'Call recording included' : 'No call recording'} • {plan?.analyticsDays === Infinity ? 'Full' : `${plan?.analyticsDays}-day`} analytics
          </Text>
          {user?.plan !== 'PREMIUM' && (
            <Button size="sm" colorScheme="primary" as="a" href="/dashboard/upgrade">Upgrade Plan</Button>
          )}
        </Box>

        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Profile</Heading>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </FormControl>
          <Text fontSize="sm" color="gray.500" mb={4}>Email: {user?.email}</Text>
          <Button colorScheme="primary">Save</Button>
        </Box>

        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>API Configuration</Heading>
          <Text color="gray.500" fontSize="sm" mb={4}>
            These settings are configured via environment variables on the server. Contact your admin to update them.
          </Text>
          <VStack align="flex-start" spacing={2}>
            <Text fontSize="sm"><Code>TELNYX_API_KEY</Code> — Your Telnyx API key</Text>
            <Text fontSize="sm"><Code>TELNYX_CONNECTION_ID</Code> — Telnyx connection ID</Text>
            <Text fontSize="sm"><Code>TELNYX_WEBHOOK_SECRET</Code> — For webhook verification</Text>
          </VStack>
        </Box>

        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Webhook URL</Heading>
          <Text color="gray.500" fontSize="sm" mb={2}>
            Configure this URL in your Telnyx portal to receive call events:
          </Text>
          <Code p={3} bg="gray.50" display="block" borderRadius="md">
            {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/telnyx
          </Code>
        </Box>
      </VStack>
    </Box>
  )
}
