'use client'

import { Box, Container, Flex, Text, Heading, Input, Button, VStack, FormControl, FormLabel, useToast, Link } from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/dashboard')
    } catch (err: any) {
      toast({ title: err.message, status: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.xl" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Flex w="full" maxW="400px" direction="column">
        <Flex align="center" gap={2} mb={8} justify="center">
          <Box w={8} h={8} bg="primary.500" borderRadius="lg" />
          <Text fontWeight="bold" fontSize="xl" color="primary.500">MCT</Text>
        </Flex>
        <Box bg="white" p={8} borderRadius="2xl" shadow="lg" border="1px" borderColor="gray.100">
          <Heading size="lg" mb={2}>Welcome back</Heading>
          <Text color="gray.500" mb={6}>Sign in to your account</Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </FormControl>
              <Button type="submit" colorScheme="primary" w="full" size="lg" isLoading={loading}>Sign In</Button>
            </VStack>
          </form>
          <Text textAlign="center" mt={4} color="gray.500" fontSize="sm">
            Don&apos;t have an account? <Link href="/register" color="primary.500" fontWeight="medium">Sign up</Link>
          </Text>
          <Text textAlign="center" mt={2}>
            <Link href="/" color="gray.400" fontSize="sm">← Back to home</Link>
          </Text>
        </Box>
      </Flex>
    </Container>
  )
}
