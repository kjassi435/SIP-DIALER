'use client'

import { Box, Heading, SimpleGrid, VStack, Text, Badge, Button, Divider, Flex, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/plans'

const planKeys = ['FREE', 'BASIC', 'PREMIUM'] as const

const features: { key: string; label: string; format: (v: any) => string | number }[] = [
  { key: 'maxNumbers', label: 'Phone Numbers', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxCampaigns', label: 'Campaigns', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxRoutes', label: 'Call Routes', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'maxIvrMenus', label: 'IVR Menus', format: (v: number) => v === Infinity ? 'Unlimited' : v },
  { key: 'callRecording', label: 'Call Recording', format: (v: boolean) => v ? '✅' : '❌' },
  { key: 'analyticsDays', label: 'Analytics History', format: (v: number) => v === Infinity ? 'All time' : `${v} days` },
  { key: 'apiAccess', label: 'API Access', format: (v: boolean) => v ? '✅' : '❌' },
  { key: 'whiteLabel', label: 'White Label', format: (v: boolean) => v ? '✅' : '❌' },
]

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState('')
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
  }, [])

  return (
    <Box p={8}>
      <Heading size="lg" mb={2}>Upgrade Your Plan</Heading>
      <Text color="gray.500" mb={6}>You are currently on the <strong>{PLANS[user?.plan as keyof typeof PLANS]?.name || 'Free'}</strong> plan.</Text>

      <SimpleGrid columns={3} spacing={6}>
        {planKeys.map(key => {
          const plan = PLANS[key]
          const isCurrent = user?.plan === key
          const isPremium = key === 'PREMIUM'

          return (
            <Box key={key} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor={isCurrent ? 'primary.500' : isPremium ? 'yellow.200' : 'gray.100'} p={6} position="relative">
              {isPremium && !isCurrent && <Badge colorScheme="yellow" position="absolute" top={4} right={4}>Popular</Badge>}
              {isCurrent && <Badge colorScheme="primary" position="absolute" top={4} right={4}>Current Plan</Badge>}
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
                {!isCurrent && (
                  <Button
                    colorScheme={isPremium ? 'yellow' : 'primary'}
                    w="full"
                    mt={2}
                    isLoading={loading === key}
                    onClick={() => {
                      toast({ title: `Request sent to upgrade to ${plan.name}`, status: 'info', duration: 3000 })
                    }}
                  >
                    {key === 'FREE' ? 'Downgrade' : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </VStack>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
