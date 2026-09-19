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
  IconExternalLink,
  IconFlame,
  IconRefresh,
  IconRotate2,
  IconSearch,
} from '@tabler/icons-react'
import classes from './all_orders.module.css'
import { client, urlFor } from '~/client'
import { type Data } from '@generated/data'
import type { RoastOrderStatus } from '#database/migrations/1789661407200_create_roast_orders_table'
import { type PaginatedProps } from '~/types'
import { Link } from '@adonisjs/inertia/react'

interface PendingRoastProps {
  roasts: PaginatedProps<Data.RoastOrder>
  filters?: {
    status?: RoastOrderStatus | 'ALL'
    search?: string
  }
}

export default function PendingRoast({ roasts, filters }: PendingRoastProps) {
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState<string>(filters?.search || '')
  const [statusFilter, setStatusFilter] = useState<string>(filters?.status || 'ALL')

  const applyFilters = (newParams: { status?: string; search?: string; page?: number }) => {
    const query = {
      status: newParams.status !== undefined ? newParams.status : statusFilter,
      search: newParams.search !== undefined ? newParams.search : search,
      page: newParams.page !== undefined ? newParams.page : 1,
    }

    startTransition(() => {
      router.get(client.urlFor('admin.pending_roast'), query, {
        preserveState: true,
        preserveScroll: true,
        only: ['roasts', 'filters'],
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

  const handleFilterChange = (val: string | null) => {
    const selected = val || 'ALL'
    setStatusFilter(selected)
    applyFilters({ status: selected, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    applyFilters({ page: newPage })
  }

  const handleUpdateRoastStatus = (roast: Data.RoastOrder, nextStatus: RoastOrderStatus) => {
    const orderId = roast.orderItem?.orderId || roast.orderItem?.order?.id
    if (!orderId) return

    router.patch(
      urlFor('admin.orders.roast.update', { id: roast.id, order_id: orderId }),
      { status: nextStatus },
      {
        preserveScroll: true,
        only: ['roasts'],
      }
    )
  }

  const renderRoastBadge = (status: RoastOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" color="yellow" radius="sm" leftSection={<IconClock size={12} />}>
            Pending
          </Badge>
        )
      case 'DONE':
        return (
          <Badge variant="light" color="teal" radius="sm" leftSection={<IconCheck size={12} />}>
            Done
          </Badge>
        )
      default:
        return <Badge radius="sm">{status}</Badge>
    }
  }

  const roastList = roasts?.data ?? []
  const pendingCountOnPage = roastList.filter((r) => r.status === 'PENDING').length

  return (
    <Box className={classes.dashboardBox} py={{ base: 24, sm: 36 }} px={{ base: 'xs', sm: 'md' }}>
      <Container size="xl" px={0}>
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Box>
              <Group gap="xs" align="center">
                <Title order={2} c="coffee.9" className={classes.pageTitle}>
                  Master Roasting Queue
                </Title>
                {pendingCountOnPage > 0 && (
                  <Badge color="yellow" variant="light" size="sm">
                    {pendingCountOnPage} Pending (This Page)
                  </Badge>
                )}
              </Group>

              <Text size="sm" c="coffee.8">
                Global roasting batches across all ongoing orders and direct drum queues.
              </Text>
            </Box>

            <Group gap="xs">
              <Button
                variant="default"
                size="sm"
                radius="md"
                color="coffee"
                leftSection={<IconRefresh size={14} />}
                onClick={() => router.reload({ only: ['roasts'] })}
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
                placeholder="Search batch #, coffee, destination, or order #..."
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
                    { value: 'DONE', label: 'Done' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                  value={statusFilter}
                  onChange={handleFilterChange}
                  allowDeselect={false}
                  w={160}
                />
              </Group>
            </Group>

            <Table.ScrollContainer minWidth={850}>
              <Table verticalSpacing="sm" horizontalSpacing="md" className={classes.table}>
                <Table.Thead className={classes.tableHead}>
                  <Table.Tr>
                    <Table.Th>Batch / Item</Table.Th>
                    <Table.Th>Associated Order</Table.Th>
                    <Table.Th>Coffee & Profile</Table.Th>
                    <Table.Th>Quantity / Grind</Table.Th>
                    <Table.Th>Scheduled</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {roastList.length > 0 ? (
                    roastList.map((roast) => {
                      const order = roast.orderItem?.order
                      const isOrderRoasting = order?.status === 'ROASTING'

                      return (
                        <Table.Tr key={roast.id} className={classes.tableRow}>
                          {/* Batch ID */}
                          <Table.Td>
                            <Group gap="xs">
                              <ThemeIcon size={28} radius="md" color="coffee" variant="light">
                                <IconFlame size={15} />
                              </ThemeIcon>
                              <Box>
                                <Text fz="xs" fw={700} c="coffee.9">
                                  Batch #{roast.id}
                                </Text>
                                <Text fz="10px" c="dimmed">
                                  Item #{roast.orderItemId}
                                </Text>
                              </Box>
                            </Group>
                          </Table.Td>

                          <Table.Td>
                            {order ? (
                              <Box>
                                <Group gap={4}>
                                  <Link
                                    route="admin.orders.roast.index"
                                    routeParams={{ order_id: order.id }}
                                    style={{
                                      textDecoration: 'none',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: 'var(--mantine-color-coffee-8)',
                                    }}
                                  >
                                    Order #{order.id}
                                  </Link>
                                  <IconExternalLink size={11} color="gray" />
                                </Group>
                                <Text fz="10px" c="dimmed">
                                  {order.user?.fullName || 'Guest Customer'}
                                </Text>
                              </Box>
                            ) : (
                              <Text fz="xs" c="dimmed">
                                Order #{roast.orderItem?.orderId || '—'}
                              </Text>
                            )}
                          </Table.Td>

                          {/* Coffee Details */}
                          <Table.Td>
                            <Text fz="sm" fw={600} c="coffee.9">
                              {roast.orderItem?.coffeeName || 'Coffee Blend'}
                            </Text>
                            <Text fz="xs" c="dimmed">
                              Profile: {roast.orderItem?.roastType || 'Standard'}
                            </Text>
                          </Table.Td>

                          {/* Specifications */}
                          <Table.Td>
                            <Text fz="xs" fw={500} c="coffee.9">
                              {roast.orderItem?.weight} &bull; {roast.orderItem?.quantity} bag(s)
                            </Text>
                            <Text fz="10px" c="dimmed">
                              Grind: {roast.orderItem?.grind || 'Whole Bean'}
                            </Text>
                          </Table.Td>

                          {/* Schedule / Created Date */}
                          <Table.Td>
                            <Text fz="xs" c="coffee.8">
                              {roast.scheduledFor
                                ? new Date(roast.scheduledFor.toString()).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )
                                : 'Immediate Queue'}
                            </Text>
                          </Table.Td>

                          {/* Roast Status */}
                          <Table.Td>{renderRoastBadge(roast.status as RoastOrderStatus)}</Table.Td>

                          {/* Actions */}
                          <Table.Td align="right">
                            <Group gap={6} justify="flex-end">
                              {roast.status === 'PENDING' ? (
                                <Button
                                  size="compact-xs"
                                  color="coffee"
                                  variant="light"
                                  radius="sm"
                                  disabled={!isOrderRoasting}
                                  title={
                                    !isOrderRoasting
                                      ? 'Order must be in ROASTING status first'
                                      : undefined
                                  }
                                  leftSection={<IconFlame size={12} />}
                                  onClick={() => handleUpdateRoastStatus(roast, 'DONE')}
                                >
                                  Mark Done
                                </Button>
                              ) : (
                                <Menu shadow="md" width={160} position="bottom-end">
                                  <Menu.Target>
                                    <ActionIcon variant="subtle" color="gray" size="sm">
                                      <IconDotsVertical size={15} />
                                    </ActionIcon>
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Label>Status Actions</Menu.Label>
                                    <Menu.Item
                                      leftSection={<IconRotate2 size={14} />}
                                      disabled={!isOrderRoasting}
                                      onClick={() => handleUpdateRoastStatus(roast, 'PENDING')}
                                    >
                                      Revert to Pending
                                    </Menu.Item>
                                  </Menu.Dropdown>
                                </Menu>
                              )}
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed" fz="sm">
                          No roasting items found matching your filters.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Group justify="space-between" mt="md" pt="xs" className={classes.tableFooter}>
              <Text size="xs" c="dimmed">
                Showing page <b>{roasts.metadata.currentPage}</b> of{' '}
                <b>{roasts.metadata.lastPage}</b> ({roasts.metadata.total} total batches)
              </Text>
              <Pagination
                total={roasts.metadata.lastPage}
                value={roasts.metadata.currentPage}
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
