import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Drawer,
  Group,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconCheck,
  IconClock,
  IconEye,
  IconFlame,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSearch,
  IconTruckDelivery,
  IconUser,
  IconUsers,
  IconX,
} from '@tabler/icons-react'

type CustomerOrder = {
  id: number
  totalAmount: number
  status: string
  createdAt: string
  itemsCount: number
  paymentStatus: string
}

type CustomerItem = {
  id: number
  fullName: string | null
  email: string
  initials: string
  role: string
  createdAt: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  orders: CustomerOrder[]
}

export type CustomerDataProps = {
  customers: {
    data: CustomerItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: {
    search?: string
  }
}

export default function CustomerData({ customers, filters }: CustomerDataProps) {
  const [search, setSearch] = useState(filters.search || '')
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null)

  const handleInspect = (customer: CustomerItem) => {
    setSelectedCustomer(customer)
    openDrawer()
  }

  const handleSearch = (val: string, page: number = 1) => {
    router.get(
      '/admin/customers',
      { search: val, page },
      { preserveState: true, preserveScroll: true }
    )
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ROASTING':
        return (
          <Badge size="xs" color="coffee" variant="light" leftSection={<IconFlame size={10} />}>
            Roasting
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge size="xs" color="yellow" variant="outline" leftSection={<IconClock size={10} />}>
            Pending
          </Badge>
        )
      case 'SHIPPED':
        return (
          <Badge size="xs" color="blue" variant="light" leftSection={<IconTruckDelivery size={10} />}>
            Shipped
          </Badge>
        )
      case 'DELIVERED':
        return (
          <Badge size="xs" color="teal" variant="light" leftSection={<IconCheck size={10} />}>
            Delivered
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge size="xs" color="gray" variant="subtle" leftSection={<IconX size={10} />}>
            Cancelled
          </Badge>
        )
      default:
        return <Badge size="xs">{status}</Badge>
    }
  }

  return (
    <Box bg="coffee.0" py={{ base: 'md', md: 'xl' }} style={{ minHeight: '100dvh' }}>
      <Container size="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="center" wrap="wrap">
            <Box>
              <Badge variant="outline" color="coffee" size="sm" mb={4} leftSection={<IconUsers size={12} />}>
                Customer Relations
              </Badge>
              <Title order={2} c="coffee.9">
                Customer Directory
              </Title>
              <Text size="sm" c="coffee.7">
                Inspect registered customers, order volume, lifetime spend, and shipping profiles.
              </Text>
            </Box>
          </Group>

          {/* Search bar */}
          <Paper p="md" radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-coffee-2)' }}>
            <TextInput
              placeholder="Search by customer name, email, phone, city..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value)
                handleSearch(e.currentTarget.value, 1)
              }}
              style={{ maxWidth: 450 }}
            />
          </Paper>

          {/* Customers Table */}
          <Paper radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-coffee-2)', overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                <Table.Thead bg="coffee.1">
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Primary Destination</Table.Th>
                    <Table.Th>Total Orders</Table.Th>
                    <Table.Th>Total Spent</Table.Th>
                    <Table.Th>Joined Date</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>History</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {customers.data.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed" size="sm">
                          No customers found matching your search.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    customers.data.map((c) => (
                      <Table.Tr key={c.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <Avatar color="coffee" radius="xl">
                              {c.initials || 'U'}
                            </Avatar>
                            <Box>
                              <Group gap={6}>
                                <Text fw={600} size="sm" c="coffee.9">
                                  {c.fullName || 'Registered User'}
                                </Text>
                                {c.role === 'ADMIN' && (
                                  <Badge size="xs" color="red">
                                    ADMIN
                                  </Badge>
                                )}
                              </Group>
                              <Text size="xs" c="dimmed">
                                {c.email}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>

                        <Table.Td>
                          <Text size="xs" c="coffee.8">
                            {c.phone}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Text size="xs" c="coffee.8" lineClamp={1}>
                            {c.address}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Badge variant="light" color="coffee" size="sm">
                            {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                          </Badge>
                        </Table.Td>

                        <Table.Td>
                          <Text fw={700} size="sm" c="coffee.9">
                            ${c.totalSpent.toFixed(2)}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Text size="xs" c="dimmed">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </Text>
                        </Table.Td>

                        <Table.Td align="right">
                          <Tooltip label="Inspect Orders">
                            <ActionIcon
                              variant="light"
                              color="coffee"
                              onClick={() => handleInspect(c)}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {customers.meta.lastPage > 1 && (
              <Group justify="space-between" p="md" style={{ borderTop: '1px solid var(--mantine-color-coffee-2)' }}>
                <Text size="xs" c="dimmed">
                  Showing page {customers.meta.currentPage} of {customers.meta.lastPage} ({customers.meta.total} customers)
                </Text>
                <Pagination
                  total={customers.meta.lastPage}
                  value={customers.meta.currentPage}
                  onChange={(page) => handleSearch(search, page)}
                  color="coffee"
                  size="sm"
                />
              </Group>
            )}
          </Paper>
        </Stack>
      </Container>

      {/* Customer Orders History Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="md"
        title={
          <Group gap="xs">
            <ThemeIcon color="coffee" variant="light" radius="md">
              <IconUser size={18} />
            </ThemeIcon>
            <Box>
              <Text fw={700} c="coffee.9">
                {selectedCustomer?.fullName || selectedCustomer?.email}
              </Text>
              <Text size="xs" c="dimmed">
                Customer #{selectedCustomer?.id}
              </Text>
            </Box>
          </Group>
        }
      >
        {selectedCustomer && (
          <Stack gap="md">
            {/* Quick Profile Summary Card */}
            <Card padding="sm" radius="md" bg="coffee.0" style={{ border: '1px solid var(--mantine-color-coffee-2)' }}>
              <Stack gap={6}>
                <Group gap="xs">
                  <IconMail size={14} color="var(--mantine-color-coffee-7)" />
                  <Text size="xs" c="coffee.9">
                    {selectedCustomer.email}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconPhone size={14} color="var(--mantine-color-coffee-7)" />
                  <Text size="xs" c="coffee.9">
                    {selectedCustomer.phone}
                  </Text>
                </Group>
                <Group gap="xs" align="flex-start">
                  <IconMapPin size={14} color="var(--mantine-color-coffee-7)" />
                  <Text size="xs" c="coffee.9">
                    {selectedCustomer.address}
                  </Text>
                </Group>
                <Divider my={4} color="coffee.2" />
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Total Volume
                  </Text>
                  <Text size="xs" fw={700} c="coffee.9">
                    {selectedCustomer.totalOrders} orders (${selectedCustomer.totalSpent.toFixed(2)})
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Orders List */}
            <Title order={4} size="sm" c="coffee.9">
              Order History
            </Title>

            {selectedCustomer.orders.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">
                No orders placed yet.
              </Text>
            ) : (
              <Stack gap="xs">
                {selectedCustomer.orders.map((o) => (
                  <Paper
                    key={o.id}
                    p="sm"
                    radius="md"
                    style={{ border: '1px solid var(--mantine-color-coffee-2)' }}
                  >
                    <Group justify="space-between" align="center">
                      <Box>
                        <Group gap={6} align="center">
                          <Text fw={700} size="sm" c="coffee.9">
                            Order #{o.id}
                          </Text>
                          {renderStatusBadge(o.status)}
                        </Group>
                        <Text size="xs" c="dimmed">
                          {new Date(o.createdAt).toLocaleDateString()} · {o.itemsCount} bag(s)
                        </Text>
                      </Box>

                      <Box style={{ textAlign: 'right' }}>
                        <Text fw={700} size="sm" c="coffee.9">
                          ${o.totalAmount.toFixed(2)}
                        </Text>
                        <Badge
                          size="xs"
                          variant="dot"
                          color={o.paymentStatus === 'PAID' ? 'teal' : 'yellow'}
                        >
                          {o.paymentStatus}
                        </Badge>
                      </Box>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Drawer>
    </Box>
  )
}
