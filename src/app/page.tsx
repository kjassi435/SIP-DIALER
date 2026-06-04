'use client'

import {
  Box, Container, Flex, Text, Heading, Button, SimpleGrid, Stack, Icon, Avatar,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Input, InputGroup, InputLeftElement,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Link, Image, Divider, HStack, VStack, useDisclosure, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, IconButton,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      {/* Navbar */}
      <Box as="nav" borderBottom="1px" borderColor="gray.100" py={4} position="sticky" top={0} bg="white" zIndex={100}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <Box w={8} h={8} bg="primary.500" borderRadius="lg" />
              <Text fontWeight="bold" fontSize="xl" color="primary.500">MCT</Text>
            </Flex>
            <Flex gap={8} display={{ base: 'none', md: 'flex' }} color="gray.600" fontWeight="medium">
              <Link href="/">Features</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/login">Contact Us</Link>
            </Flex>
            <Flex gap={3} display={{ base: 'none', md: 'flex' }}>
              <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
              <Button colorScheme="primary" onClick={() => router.push('/register')}>Get Started</Button>
            </Flex>
            <IconButton aria-label="Menu" icon={<Box as="span" fontSize="2xl">☰</Box>} display={{ base: 'flex', md: 'none' }} onClick={onOpen} variant="ghost" />
          </Flex>
        </Container>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <Link href="/">Features</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/login">Contact Us</Link>
              <Button variant="outline" onClick={() => router.push('/login')}>Sign In</Button>
              <Button colorScheme="primary" onClick={() => router.push('/register')}>Get Started</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Hero */}
      <Box bg="linear-gradient(135deg, #f9f6fd 0%, #f4fbfd 100%)" py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={12}>
            <VStack align="flex-start" spacing={6} flex={1}>
              <Heading as="h1" fontSize={{ base: '4xl', lg: '6xl' }} fontWeight="extrabold" lineHeight="shorter">
                <Text as="span" color="primary.500">The Only Tracking</Text>
                <br />
                Software You Need
              </Heading>
              <Text fontSize="xl" color="gray.600" lineHeight="tall">
                MCT is a <Text as="span" fontStyle="italic">Fast And Robust Platform</Text> that lets you set up a modern call tracking solution to measure your campaign effectiveness, optimize ad campaigns with virtual phone numbers & instant analytics.
              </Text>
              <HStack spacing={4}>
                <Button size="lg" colorScheme="primary" onClick={() => router.push('/register')}>Contact us</Button>
                <Button size="lg" variant="outline">Learn more</Button>
              </HStack>
            </VStack>
            <Box flex={1} bg="primary.100" borderRadius="2xl" p={8} w="full" maxW="500px">
              <Image src="https://placehold.co/500x350/8952e0/white?text=Call+Tracking+Dashboard" alt="Dashboard preview" borderRadius="xl" />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {[
              { title: 'Call Tracking', desc: 'Track your call data and insights to enhance your marketing strategy.' },
              { title: 'Live Call Monitoring', desc: 'Apply instant changes to your current campaigns and immediately check the live results.' },
              { title: 'VoIP Block', desc: 'Block VoIP Calls to keep your Campaign clean and save on quality calls.' },
              { title: 'IVR Authentication', desc: 'Enable IVR Authentication to avoid spam and robo calls and accept only Genuine calls.' },
              { title: 'Caller ID Block', desc: 'Block CallerID to filter out repeated calls.' },
              { title: 'Duplicate Management', desc: 'Manage calls by distributing evenly to different buyers or route to the same buyer.' },
              { title: 'Real-Time Reports', desc: 'Get realtime reports on live calls and on calls that have just been disconnected.' },
              { title: 'Advance Reporting', desc: 'Filter out VoIP calls, Blocked Calls or IVR Authenticated calls and manage your campaign.' },
            ].map((f, i) => (
              <Box key={i} p={6} borderRadius="xl" border="1px" borderColor="gray.100" _hover={{ shadow: 'md', borderColor: 'primary.200' }} transition="all 0.2s">
                <Box w={10} h={10} bg="primary.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <Text color="primary.500" fontWeight="bold">{i + 1}</Text>
                </Box>
                <Text fontWeight="bold" mb={2}>{f.title}</Text>
                <Text color="gray.600" fontSize="sm">{f.desc}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="primary.500" py={16}>
        <Container maxW="container.xl" textAlign="center">
          <Heading color="white" fontSize={{ base: '3xl', lg: '5xl' }} mb={4}>
            Take your calls to a new level
          </Heading>
          <Text color="whiteAlpha.800" fontSize="xl" mb={8}>
            Track, Analyze, and Optimize Every Call with Ease!
          </Text>
          <Button size="lg" bg="white" color="primary.500" _hover={{ bg: 'gray.100' }} onClick={() => router.push('/register')}>
            Start Your Tracking Business With Us
          </Button>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={12}>
            <Box flex={1}>
              <Badge colorScheme="primary" mb={4}>Key Benefit</Badge>
              <Heading fontSize={{ base: '3xl', lg: '4xl' }} mb={4}>
                Why Choose Us?
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Leverage cutting-edge call tracking to gain actionable insights, maximize your ROI, and streamline your business operations. Focus on what truly matters—delivering value to your customers.
              </Text>
            </Box>
            <Box flex={1}>
              <SimpleGrid columns={2} spacing={4}>
                {['Call Blocking', 'Real-Time Tracking', 'IVR Authentication', 'Caller Info', 'Duplicate Management', 'Instant Reports', 'VoIP Blocking', 'Call Recording'].map((feature, i) => (
                  <Flex key={i} align="center" gap={2} p={3} bg="gray.50" borderRadius="lg">
                    <Text color="primary.500">✓</Text>
                    <Text fontSize="sm" fontWeight="medium">{feature}</Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Demo Table */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <Heading textAlign="center" fontSize={{ base: '3xl', lg: '4xl' }} mb={12}>
            Obtain more features to become better at your campaigns
          </Heading>
          <Box overflowX="auto" bg="white" borderRadius="xl" shadow="sm">
            <Table>
              <Thead bg="gray.50">
                <Tr>
                  <Th>PRIORITY</Th>
                  <Th>WEIGHT</Th>
                  <Th>NAME</Th>
                  <Th>NUMBER</Th>
                  <Th>STATUS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  { priority: 1, weight: 100, name: 'Darrell Steward', number: '+123456' },
                  { priority: 2, weight: 100, name: 'Annette Black', number: '+123490' },
                  { priority: 3, weight: 100, name: 'Bessie Cooper', number: '+123481' },
                  { priority: 4, weight: 100, name: 'Group', number: '+153129' },
                  { priority: 5, weight: 100, name: '-//-', number: '+131481' },
                ].map((row, i) => (
                  <Tr key={i}>
                    <Td>{row.priority}</Td>
                    <Td><Badge colorScheme="primary">{row.weight}</Badge></Td>
                    <Td>{row.name}</Td>
                    <Td>{row.number}</Td>
                    <Td><Badge colorScheme="green">Active</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Flex gap={4} mt={4} flexWrap="wrap">
            <Badge p={2} colorScheme="blue">BING ADS</Badge>
            <Badge p={2}>Ad Id: 836639220104</Badge>
            <Badge p={2}>Campaign Id: 757470001</Badge>
            <Badge p={2}>Keyword: health medical insurance providers</Badge>
          </Flex>
        </Container>
      </Box>

      {/* Features Details */}
      <Box py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
            <Box>
              <Heading fontSize="2xl" mb={4}>Advanced reporting</Heading>
              <Text color="gray.600">Study the data about inbound calls, their duration, and the keywords that triggered the calls. Make data-driven decisions to earn more.</Text>
            </Box>
            <Box>
              <Heading fontSize="2xl" mb={4}>Call attribution</Heading>
              <Text color="gray.600">Apply the changes in real time. Keep an eye on your promotion budget and ROI.</Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box id="pricing" py={20} bg="gray.50">
        <Container maxW="container.xl">
          <Heading textAlign="center" fontSize={{ base: '3xl', lg: '4xl' }} mb={4}>
            Pricing for every stage
          </Heading>
          <Text textAlign="center" color="gray.600" mb={12} fontSize="lg">
            Choose a plan that fits your business needs. Flexible pricing with powerful features included in all plans.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              { key: 'FREE', name: 'Free', price: '$0', desc: '1 number, 1 campaign', features: ['1 Phone Number', '1 Campaign', '1 Call Route', '1 IVR Menu', '7-Day Analytics'], popular: false },
              { key: 'BASIC', name: 'Basic', price: '$1.99', desc: '5 numbers, call recording', features: ['5 Phone Numbers', '5 Campaigns', '5 Call Routes', '3 IVR Menus', 'Call Recording', '30-Day Analytics', '1 SIP Account'], popular: true },
              { key: 'PREMIUM', name: 'Premium', price: '$4.99', desc: 'Everything unlimited', features: ['Unlimited Numbers', 'Unlimited Campaigns', 'Unlimited Routes', 'Unlimited IVR Menus', 'Call Recording', 'Full Analytics', 'Unlimited SIP Accounts', 'API Access', 'White Label'], popular: false },
            ].map((plan, i) => (
              <Box key={i} p={8} bg="white" borderRadius="2xl" border={plan.popular ? '2px' : '1px'} borderColor={plan.popular ? 'primary.500' : 'gray.200'} shadow={plan.popular ? 'lg' : 'none'} position="relative">
                {plan.popular && <Badge colorScheme="primary" position="absolute" top={-3} left="50%" transform="translateX(-50%)">Popular</Badge>}
                <Text fontWeight="bold" fontSize="xl" mb={2}>{plan.name}</Text>
                <Text fontSize="4xl" fontWeight="bold" mb={1}>{plan.price}</Text>
                <Text color="gray.500" mb={6}>/month</Text>
                <Text color="gray.600" fontSize="sm" mb={6}>{plan.desc}</Text>
                <VStack align="flex-start" spacing={3} mb={8}>
                  {plan.features.map((feat, j) => (
                    <Flex key={j} align="center" gap={2}>
                      <Text color="primary.500">✓</Text>
                      <Text fontSize="sm">{feat}</Text>
                    </Flex>
                  ))}
                </VStack>
                <Button w="full" colorScheme={plan.popular ? 'primary' : 'gray'} variant={plan.popular ? 'solid' : 'outline'} onClick={() => router.push('/register')}>
                  Get Started
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box id="faq" py={20}>
        <Container maxW="800px">
          <Heading textAlign="center" fontSize={{ base: '3xl', lg: '4xl' }} mb={12}>Frequently Asked Questions</Heading>
          <Accordion allowToggle>
            {[
              { q: 'How many phone numbers can I use for the call routing service?', a: 'MCT does not set restrictions on the quantity or type of phone numbers. It depends on how many virtual phone numbers you have purchased. You can direct calls to local, toll-free, or international phone numbers.' },
              { q: 'How much does business call routing cost?', a: 'The call routing feature is included in our functionality. Users are not required to pay any additional fees.' },
              { q: 'How many types of call routing does MCT offer?', a: 'MCT provides its users with standard and menu call forwarding. With standard routing, inbound calls are distributed evenly between the destinations. Menu call routing is enabled with an interactive voice response system.' },
              { q: 'How do I choose the best call routing strategy?', a: 'It depends on the goals you wish to achieve. Standard routing guarantees an equal workload among the destinations. IVR routing allows you to send callers directly to the experts with the most relevant competence.' },
              { q: 'Can I use call routing if I have a small business?', a: 'Sure. The call routing feature allows you to tailor the time and quantity of calls you are prepared to process in a day. The functionality is available to all businesses, regardless of size.' },
            ].map((faq, i) => (
              <AccordionItem key={i} border="none" mb={2}>
                <AccordionButton bg="gray.50" borderRadius="lg" _expanded={{ bg: 'primary.50', borderBottomRadius: 0 }}>
                  <Box flex="1" textAlign="left" fontWeight="medium">{faq.q}</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel bg="primary.50" borderRadius="0 0 lg lg" pb={4}>{faq.a}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white" py={12}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap={8}>
            <Box>
              <Flex align="center" gap={2} mb={4}>
                <Box w={8} h={8} bg="primary.500" borderRadius="lg" />
                <Text fontWeight="bold" fontSize="xl">MCT</Text>
              </Flex>
              <Text color="gray.400" maxW="300px">Powering your call tracking success with cutting-edge technology and real-time analytics.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
              <Box>
                <Text fontWeight="bold" mb={4}>Product</Text>
                <VStack align="flex-start" spacing={2} color="gray.400">
                  <Link href="/">Features</Link>
                  <Link href="/#pricing">Pricing</Link>
                  <Link href="/#faq">FAQ</Link>
                </VStack>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={4}>Company</Text>
                <VStack align="flex-start" spacing={2} color="gray.400">
                  <Link href="/">About</Link>
                  <Link href="/">Blog</Link>
                  <Link href="/">Contact</Link>
                </VStack>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={4}>Support</Text>
                <VStack align="flex-start" spacing={2} color="gray.400">
                  <Link href="/">Help Center</Link>
                  <Link href="/">Documentation</Link>
                  <Link href="/">API Status</Link>
                </VStack>
              </Box>
            </SimpleGrid>
          </Flex>
          <Divider my={8} borderColor="gray.700" />
          <Text textAlign="center" color="gray.500" fontSize="sm">© 2026 MCT - My Call Tracking. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  )
}
