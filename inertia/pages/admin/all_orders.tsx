import { useState, useTransition } from 'react'
import { router } from '@inertiajs/react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Menu,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import {
  IconCheck,
  IconClock,
  IconDotsVertical,
  IconEye,
  IconFlame,
  IconPackage,
  IconRefresh,
  IconSearch,
  IconTruckDelivery,
  IconX,
} from '@tabler/icons-react'
import classes from './all_orders.module.css'
import type { OrderStatus } from '#database/migrations/1789290844108_create_orders_table'
import { client, urlFor } from '~/client'
import { type PaginatedProps } from '~/types'
import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

interface AllOrderProps {
  orders: PaginatedProps<Data.Order>
  filters: {
    search: string
    status: OrderStatus
  }
}

const NEXT_ORDER_STATUS: Partial<
  Record<
    OrderStatus,
    {
      next: OrderStatus
      label: string
      icon: React.ReactNode
    }
  >
> = {
  PENDING: {
    next: 'ROASTING',
    label: 'Mark as Roasting',
    icon: <IconFlame size={14} color="var(--mantine-color-coffee-6)" />,
  },
  ROASTING: {
    next: 'SHIPPED',
    label: 'Mark as Shipped',
    icon: <IconTruckDelivery size={14} />,
  },
  SHIPPED: {
    next: 'DELIVERED',
    label: 'Mark as Delivered',
    icon: <IconCheck size={14} />,
  },
}

export default function AllOrders({ orders, filters }: AllOrderProps) {
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(filters?.search || '')
  const [statusFilter, setStatusFilter] = useState<string | null>(filters?.status || 'ALL')

  const applyFilters = (newParams: { search?: string; status?: string | null; page?: number }) => {
    const query = {
      search: newParams.search !== undefined ? newParams.search : search,
      status: newParams.status !== undefined ? newParams.status : statusFilter,
      page: newParams.page !== undefined ? newParams.page : 1,
    }

    startTransition(() => {
      router.get(client.urlFor('admin.orders'), query, {
        preserveState: true,
        preserveScroll: true,
        only: ['orders', 'filters'],
      })
    })
  }

  const debouncedSearch = useDebouncedCallback((val: string) => {
    applyFilters({ search: val, page: 1 })
  }, 350)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    setSearch(val)
    debouncedSearch(val)
  }

  const handleStatusChange = (val: string | null) => {
    setStatusFilter(val)
    applyFilters({ status: val, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    applyFilters({ page: newPage })
  }

  const handleUpdateOrderStatus = (order: Data.Order, nextStatus: OrderStatus) => {
    if (nextStatus === order.status) return
    if (nextStatus === 'CANCELLED' && !confirm('Cancel this order?')) return
    router.patch(
      urlFor('admin.orders.updateStatus', { id: order.id }),
      { status: nextStatus },
      {
        preserveScroll: true,
        only: ['orders'],
      }
    )
  }

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ROASTING':
        return (
          <Badge variant="light" color="coffee" radius="sm" leftSection={<IconFlame size={12} />}>
            Roasting
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge variant="outline" color="yellow" radius="sm" leftSection={<IconClock size={12} />}>
            Pending
          </Badge>
        )
      case 'SHIPPED':
        return (
          <Badge
            variant="light"
            color="blue"
            radius="sm"
            leftSection={<IconTruckDelivery size={12} />}
          >
            Shipped
          </Badge>
        )
      case 'DELIVERED':
        return (
          <Badge variant="light" color="teal" radius="sm" leftSection={<IconCheck size={12} />}>
            Delivered
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge variant="subtle" color="gray" radius="sm" leftSection={<IconX size={12} />}>
            Cancelled
          </Badge>
        )
    }
  }

  const rows = orders.data.map((order) => {
    const count = order.itemsCount ?? order.items?.length ?? 0
    const formattedDate = new Date(order.createdAt!.toString())
    const nextStep = NEXT_ORDER_STATUS[order.status]
    const canCancel = order.status !== 'DELIVERED' && order.status !== 'CANCELLED'

    return (
      <Table.Tr key={order.id} className={classes.tableRow}>
        <Table.Td>
          <Group gap="xs">
            <ThemeIcon size={28} radius="md" color="coffee" variant="light">
              <IconPackage size={15} />
            </ThemeIcon>
            <Box>
              <Text fz="sm" fw={600} c="coffee.9">
                #{order.id}
              </Text>
              <Text fz="xs" c="dimmed">
                {count} {count === 1 ? 'item' : 'items'}
              </Text>
            </Box>
          </Group>
        </Table.Td>

        <Table.Td>
          <Text fz="sm" fw={500} c="coffee.9">
            {order.user?.fullName || 'Guest Customer'}
          </Text>
          <Text fz="xs" c="dimmed">
            {order.user?.email || '—'}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text fz="xs" c="coffee.8">
            {formattedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <Text fz="10px" c="dimmed">
            {formattedDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text fz="xs" fw={500} c="coffee.9">
            {order.shippingCity}, {order.shippingCountry}
          </Text>
          <Text fz="10px" c="dimmed" lineClamp={1}>
            {order.shippingAddress}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text fz="sm" fw={600} c="coffee.9">
            ${Number(order.totalAmount).toFixed(2)}
          </Text>
          <Text fz="10px" c="dimmed">
            Shipping: ${Number(order.shippingCost).toFixed(2)}
          </Text>
        </Table.Td>

        <Table.Td>{renderStatusBadge(order.status)}</Table.Td>

        <Table.Td align="right">
          <Group gap={6} justify="flex-end">
            <ActionIcon
              variant="light"
              color="coffee"
              size="sm"
              aria-label={`View roasts for order #${order.id}`}
              title="View Roasting Queue"
              onClick={() => router.visit(`/admin/orders/${order.id}/roasts`)}
            >
              <IconFlame size={15} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="coffee"
              size="sm"
              aria-label={`View order ${order.id}`}
              onClick={() => router.visit(`/admin/orders/${order.id}`)}
            >
              <IconEye size={16} />
            </ActionIcon>

            <Menu shadow="md" width={190} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm" aria-label="More actions">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Order Queue</Menu.Label>
                <Menu.Item
                  component={Link}
                  leftSection={<IconFlame size={14} color="var(--mantine-color-coffee-6)" />}
                  route="admin.orders.roast.index"
                  routeParams={{ order_id: order.id }}
                >
                  View Roast Items
                </Menu.Item>

                {(nextStep || canCancel) && (
                  <>
                    <Menu.Divider />
                    <Menu.Label>Update Status</Menu.Label>

                    {nextStep && (
                      <Menu.Item
                        leftSection={nextStep.icon}
                        onClick={() => handleUpdateOrderStatus(order, nextStep.next)}
                      >
                        {nextStep.label}
                      </Menu.Item>
                    )}

                    {canCancel && (
                      <Menu.Item
                        color="red"
                        leftSection={<IconX size={14} />}
                        onClick={() => handleUpdateOrderStatus(order, 'CANCELLED')}
                      >
                        Cancel Order
                      </Menu.Item>
                    )}
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Box className={classes.dashboardBox} py={{ base: 24, sm: 36 }} px={{ base: 'xs', sm: 'md' }}>
      <Container size="xl" px={0}>
        <Stack gap="lg">
          <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
            <Box>
              <Badge
                variant="outline"
                color="coffee"
                size="sm"
                radius="sm"
                leftSection={<IconFlame size={12} />}
                mb={6}
              >
                Fulfillment Terminal
              </Badge>
              <Title order={2} c="coffee.9" className={classes.pageTitle}>
                Roastery Orders
              </Title>
              <Text size="sm" c="coffee.8">
                Track drum batches, roasting queues, and direct shipments.
              </Text>
            </Box>

            <Group gap="xs">
              <Button
                variant="default"
                size="sm"
                radius="md"
                color="coffee"
                leftSection={<IconRefresh size={14} />}
                onClick={() => router.reload({ only: ['orders'] })}
                loading={isPending}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          <Paper radius="md" p="md" className={classes.tablePaper} pos="relative">
            <LoadingOverlay
              visible={isPending}
              overlayProps={{ radius: 'md', blur: 1.5, opacity: 0.3 }}
              loaderProps={{ color: 'coffee' }}
            />

            <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
              <TextInput
                placeholder="Search by order #, customer, email, or city..."
                size="sm"
                radius="md"
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={handleSearchChange}
                className={classes.searchInput}
              />

              <Group gap="xs">
                <Select
                  size="sm"
                  radius="md"
                  data={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'ROASTING', label: 'Roasting' },
                    { value: 'SHIPPED', label: 'Shipped' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                  value={statusFilter}
                  onChange={handleStatusChange}
                  allowDeselect={false}
                  w={160}
                />
              </Group>
            </Group>

            <Table.ScrollContainer minWidth={750}>
              <Table verticalSpacing="sm" horizontalSpacing="md" className={classes.table}>
                <Table.Thead className={classes.tableHead}>
                  <Table.Tr>
                    <Table.Th>Order</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Date Placed</Table.Th>
                    <Table.Th>Destination</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed" fz="sm">
                          No coffee orders match the current criteria.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Group justify="space-between" mt="md" pt="xs" className={classes.tableFooter}>
              <Text size="xs" c="dimmed">
                Showing page <b>{orders.metadata.currentPage}</b> of{' '}
                <b>{orders.metadata.lastPage}</b> ({orders.metadata.total} total orders)
              </Text>
              <Pagination
                total={orders.metadata.lastPage}
                value={orders.metadata.currentPage}
                onChange={handlePageChange}
                size="sm"
                color="coffee"
                radius="md"
              />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
