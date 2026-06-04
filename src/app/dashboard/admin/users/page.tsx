'use client'

import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Select, useToast, Text, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, VStack, FormControl, FormLabel } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { PLANS } from '@/lib/plans'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editPlan, setEditPlan] = useState('')
  const [editRole, setEditRole] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function loadUsers() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    if (data.users) setUsers(data.users)
  }

  useEffect(() => { loadUsers() }, [])

  function openEdit(user: any) {
    setEditingUser(user)
    setEditPlan(user.plan)
    setEditRole(user.role)
    onOpen()
  }

  async function saveUser() {
    if (!editingUser) return
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: editingUser.id, plan: editPlan, role: editRole }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast({ title: data.error || 'Failed to update', status: 'error' })
      return
    }
    toast({ title: 'User updated', status: 'success' })
    onClose()
    loadUsers()
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">All Users</Heading>
        <Text color="gray.500" fontSize="sm">{users.length} total users</Text>
      </Flex>

      <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Plan</Th>
              <Th>Role</Th>
              <Th>Numbers</Th>
              <Th>Campaigns</Th>
              <Th>Routes</Th>
              <Th>IVR</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(u => {
              const plan = PLANS[u.plan as keyof typeof PLANS]
              return (
                <Tr key={u.id}>
                  <Td fontWeight="medium">{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <Badge colorScheme={u.plan === 'PREMIUM' ? 'yellow' : u.plan === 'BASIC' ? 'cyan' : 'gray'}>
                      {plan?.name || u.plan}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={u.role === 'SUPER_ADMIN' ? 'red' : 'blue'}>
                      {u.role === 'SUPER_ADMIN' ? 'Admin' : 'User'}
                    </Badge>
                  </Td>
                  <Td>{u._count.phoneNumbers}</Td>
                  <Td>{u._count.campaigns}</Td>
                  <Td>{u._count.callRoutes}</Td>
                  <Td>{u._count.ivrMenus}</Td>
                  <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Button size="xs" colorScheme="primary" onClick={() => openEdit(u)}>Edit</Button>
                  </Td>
                </Tr>
              )
            })}
            {users.length === 0 && (
              <Tr><Td colSpan={10} textAlign="center" color="gray.400" py={8}>No users yet</Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User: {editingUser?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Plan</FormLabel>
                <Select value={editPlan} onChange={e => setEditPlan(e.target.value)}>
                  <option value="FREE">Free</option>
                  <option value="BASIC">Basic ($1.99/mo)</option>
                  <option value="PREMIUM">Premium ($4.99/mo)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select value={editRole} onChange={e => setEditRole(e.target.value)}>
                  <option value="USER">User</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </Select>
              </FormControl>
              <Button colorScheme="primary" w="full" onClick={saveUser}>Save Changes</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
