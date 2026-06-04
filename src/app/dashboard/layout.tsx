'use client'

import { Box, Flex, Text, VStack, HStack, Link as ChakraLink, Avatar, Menu, MenuButton, MenuList, MenuItem, Divider, Badge } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { PLANS } from '@/lib/plans'

const userNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Phone Numbers', href: '/dashboard/numbers', icon: '📞' },
  { label: 'SIP Accounts', href: '/dashboard/sip-accounts', icon: '🔗' },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: '🎯' },
  { label: 'Call Routing', href: '/dashboard/routing', icon: '🔄' },
  { label: 'IVR Menus', href: '/dashboard/ivr', icon: '🎤' },
  { label: 'Call Logs', href: '/dashboard/calls', icon: '📋' },
  { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

const adminNavItems = [
  { label: 'All Users', href: '/dashboard/admin/users', icon: '👥' },
  { label: 'Plans', href: '/dashboard/admin/plans', icon: '💎' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const isAdmin = user?.role === 'SUPER_ADMIN'
  const planInfo = PLANS[user?.plan as keyof typeof PLANS]

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user)
      else router.push('/login')
    })
  }, [])

  async function handleLogout() {
    document.cookie = 'token=; path=/; max-age=0'
    router.push('/login')
  }

  function NavItem({ item }: { item: typeof userNavItems[0] }) {
    const active = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <ChakraLink key={item.href} href={item.href} _hover={{ textDecoration: 'none' }}>
        <Flex align="center" gap={3} px={6} py={3} bg={active ? 'primary.500' : 'transparent'} color={active ? 'white' : 'gray.400'} _hover={{ bg: active ? 'primary.500' : 'gray.800', color: 'white' }} transition="all 0.2s" fontSize="sm" fontWeight={active ? 'semibold' : 'normal'}>
          <Text fontSize="lg">{item.icon}</Text>
          <Text>{item.label}</Text>
        </Flex>
      </ChakraLink>
    )
  }

  return (
    <Flex minH="100vh">
      <Box w="260px" bg="gray.900" color="white" display={{ base: 'none', lg: 'flex' }} flexDirection="column" position="fixed" h="100vh">
        <Flex align="center" gap={2} p={6} borderBottom="1px" borderColor="gray.700">
          <Box w={8} h={8} bg="primary.500" borderRadius="lg" />
          <Text fontWeight="bold" fontSize="lg">MCT</Text>
          {planInfo && <Badge colorScheme={user.plan === 'PREMIUM' ? 'yellow' : user.plan === 'BASIC' ? 'cyan' : 'gray'} fontSize="xs" variant="solid">{planInfo.name}</Badge>}
        </Flex>
        <VStack spacing={0} align="stretch" flex={1} overflowY="auto" py={4}>
          {userNavItems.map(item => <NavItem key={item.href} item={item} />)}
          {isAdmin && (
            <>
              <Divider borderColor="gray.700" my={2} />
              <Text px={6} py={2} fontSize="xs" color="gray.500" fontWeight="semibold" letterSpacing="wider">ADMIN</Text>
              {adminNavItems.map(item => <NavItem key={item.href} item={item} />)}
            </>
          )}
        </VStack>
        <Box p={6} borderTop="1px" borderColor="gray.700">
          <Menu>
            <MenuButton as={Flex} align="center" gap={3} cursor="pointer" _hover={{ opacity: 0.8 }}>
              <Avatar size="sm" name={user?.name} bg="primary.500" />
              <Box>
                <Text fontSize="sm" fontWeight="medium">{user?.name || 'User'}</Text>
                <Text fontSize="xs" color="gray.400">{user?.email}</Text>
              </Box>
            </MenuButton>
            <MenuList color="gray.800">
              <MenuItem onClick={() => router.push('/dashboard/settings')}>Settings</MenuItem>
              <MenuItem onClick={() => router.push('/dashboard/upgrade')}>Upgrade Plan</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Box display={{ base: 'block', lg: 'none' }} position="fixed" top={0} left={0} right={0} bg="white" zIndex={100} borderBottom="1px" borderColor="gray.200" p={4}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <Box w={8} h={8} bg="primary.500" borderRadius="lg" />
            <Text fontWeight="bold">MCT</Text>
            {planInfo && <Badge colorScheme={user.plan === 'PREMIUM' ? 'yellow' : 'cyan'} fontSize="xs">{planInfo.name}</Badge>}
          </Flex>
          <Menu>
            <MenuButton as={Avatar} size="sm" name={user?.name} bg="primary.500" cursor="pointer" />
            <MenuList>
              {userNavItems.map(item => (
                <MenuItem key={item.href} onClick={() => router.push(item.href)}>{item.label}</MenuItem>
              ))}
              {isAdmin && adminNavItems.map(item => (
                <MenuItem key={item.href} onClick={() => router.push(item.href)}>{item.label}</MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={() => router.push('/dashboard/upgrade')}>Upgrade Plan</MenuItem>
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box flex={1} ml={{ base: 0, lg: '260px' }} pt={{ base: '64px', lg: 0 }} bg="gray.50" minH="100vh">
        {children}
      </Box>
    </Flex>
  )
}
