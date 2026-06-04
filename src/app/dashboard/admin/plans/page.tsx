'use client'

import { Box, Heading, SimpleGrid, VStack, Text, Badge, Button, HStack, Divider, Flex } from '@chakra-ui/react'
import { PLANS } from '@/lib/plans'

const planKeys = ['FREE', 'BASIC', 'PREMIUM'] as const

const features: { key: string; label: string; format: (v: any) => string | number }[] = [
  { key: 'maxNumbers', label: 'Phone Numbers', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxCampaigns', label: 'Campaigns', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxRoutes', label: 'Call Routes', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxIvrMenus', label: 'IVR Menus', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxSipAccounts', label: 'SIP Accounts', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'callRecording', label: 'Call Recording', format: (v: boolean) => v ? '✅' : '❌' },
  { key: 'analyticsDays', label: 'Analytics History', format: (v: number) => v === Infinity ? 'All time' : `${v} days` },
  { key: 'apiAccess', label: 'API Access', format: (v: boolean) => v ? '✅' : '❌' },
  { key: 'whiteLabel', label: 'White Label', format: (v: boolean) => v ? '✅' : '❌' },
]

export default function AdminPlansPage() {
  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Plans Overview</Heading>

      <SimpleGrid columns={3} spacing={6}>
        {planKeys.map(key => {
          const plan = PLANS[key]
          const isFree = key === 'FREE'
          const isPremium = key === 'PREMIUM'
          return (
            <Box key={key} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor={isPremium ? 'yellow.200' : 'gray.100'} p={6} position="relative">
              {isPremium && (
                <Badge colorScheme="yellow" position="absolute" top={4} right={4}>Popular</Badge>
              )}
              <VStack align="flex-start" spacing={4}>
                <Box>
                  <Heading size="md">{plan.name}</Heading>
                  <Text fontSize="3xl" fontWeight="bold" mt={2}>
                    ${plan.price}<Text as="span" fontSize="sm" fontWeight="normal" color="gray.500">/mo</Text>
                  </Text>
                </Box>
                <Divider />
                {features.map(f => (
                  <Flex key={f.key} justify="space-between" w="full" fontSize="sm">
                    <Text color="gray.500">{f.label}</Text>
                    <Text fontWeight="medium">{f.format((plan as any)[f.key])}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
