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
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconDotsVertical,
  IconFlame,
  IconRefresh,
  IconRotate2,
} from '@tabler/icons-react'
import classes from './all_orders.module.css'
import { urlFor } from '~/client'
import { type Data } from '@generated/data'
import type { RoastOrderStatus } from '#database/migrations/1789661407200_create_roast_orders_table'
import { type PaginatedProps } from '~/types'

interface OrderRoastsProps {
  order: Data.Order
  roasts: PaginatedProps<Data.RoastOrder>
  currentFilter?: RoastOrderStatus | 'ALL'
}

export default function OrderRoasts({ order, roasts, currentFilter = 'ALL' }: OrderRoastsProps) {
  const [isPending, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState<string>(currentFilter)

  const applyFilters = (newParams: { status?: string; page?: number }) => {
    const query = {
      status: newParams.status !== undefined ? newParams.status : statusFilter,
      page: newParams.page !== undefined ? newParams.page : 1,
    }

    startTransition(() => {
      router.get(urlFor('admin.orders.roast.index', { order_id: order.id }), query, {
        preserveState: true,
        preserveScroll: true,
        only: ['roasts', 'currentFilter'],
      })
    })
  }

  const handleFilterChange = (val: string | null) => {
    const selected = val || 'ALL'
    setStatusFilter(selected)
    applyFilters({ status: selected, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    applyFilters({ page: newPage })
  }

  const handleUpdateRoastStatus = (roastId: number, nextStatus: RoastOrderStatus) => {
    router.patch(
      urlFor('admin.orders.roast.update', { id: roastId, order_id: order.id }),
      { status: nextStatus },
      { preserveScroll: true, only: ['roasts', 'order'] }
    )
  }

  const renderRoastBadge = (status: RoastOrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" color="yellow" radius="sm" leftSection={<IconClock size={12} />}>
            Pending
          </Badge>
        )
      case 'done':
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
  const pendingCountOnPage = roastList.filter((r) => r.status === 'pending').length

  return (
    <Box className={classes.dashboardBox} py={{ base: 24, sm: 36 }} px={{ base: 'xs', sm: 'md' }}>
      <Container size="xl" px={0}>
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Box>
              <Button
                variant="subtle"
                color="coffee"
                size="xs"
                leftSection={<IconArrowLeft size={14} />}
                onClick={() => router.visit('/admin/orders')}
                mb="xs"
                p={0}
              >
                Back to Orders
              </Button>

              <Group gap="xs" align="center">
                <Title order={2} c="coffee.9" className={classes.pageTitle}>
                  Order #{order.id} Roasting Queue
                </Title>
                {pendingCountOnPage > 0 && (
                  <Badge color="yellow" variant="light" size="sm">
                    {pendingCountOnPage} Pending
                  </Badge>
                )}
              </Group>

              <Text size="sm" c="coffee.8">
                Customer: <b>{order.user?.fullName || 'Guest'}</b> &bull; Destination:{' '}
                <b>
                  {order.shippingCity}, {order.shippingCountry}
                </b>
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

            <Group justify="space-between" mb="md">
              <Text fz="sm" fw={600} c="coffee.9">
                Roast Items ({roasts.metadata.total})
              </Text>
              <Select
                size="xs"
                radius="md"
                data={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending Only' },
                  { value: 'done', label: 'Done' },
                ]}
                value={statusFilter}
                onChange={handleFilterChange}
                allowDeselect={false}
                w={160}
              />
            </Group>

            <Table.ScrollContainer minWidth={700}>
              <Table verticalSpacing="sm" horizontalSpacing="md" className={classes.table}>
                <Table.Thead className={classes.tableHead}>
                  <Table.Tr>
                    <Table.Th>Batch</Table.Th>
                    <Table.Th>Coffee & Profile</Table.Th>
                    <Table.Th>Quantity / Grind</Table.Th>
                    <Table.Th>Scheduled</Table.Th>
                    <Table.Th>Roast Status</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {roastList.length > 0 ? (
                    roastList.map((roast) => (
                      <Table.Tr key={roast.id} className={classes.tableRow}>
                        <Table.Td>
                          <Group gap="xs">
                            <ThemeIcon size={26} radius="md" color="coffee" variant="light">
                              <IconFlame size={14} />
                            </ThemeIcon>
                            <Box>
                              <Text fz="xs" fw={700} c="coffee.9">
                                #{roast.id}
                              </Text>
                              <Text fz="10px" c="dimmed">
                                Item #{roast.orderItemId}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>

                        <Table.Td>
                          <Text fz="sm" fw={600} c="coffee.9">
                            {roast.orderItem?.coffeeName || 'Coffee Blend'}
                          </Text>
                          <Text fz="xs" c="dimmed">
                            Profile: {roast.orderItem?.roastType || 'Standard'}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Text fz="xs" fw={500} c="coffee.9">
                            {roast.orderItem?.weight} &bull; {roast.orderItem?.quantity} bag(s)
                          </Text>
                          <Text fz="10px" c="dimmed">
                            Grind: {roast.orderItem?.grind || 'Whole Bean'}
                          </Text>
                        </Table.Td>

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

                        <Table.Td>{renderRoastBadge(roast.status as RoastOrderStatus)}</Table.Td>

                        <Table.Td align="right">
                          <Group gap={6} justify="flex-end">
                            {roast.status === 'pending' ? (
                              <Button
                                size="compact-xs"
                                color="coffee"
                                variant="light"
                                leftSection={<IconFlame size={12} />}
                                onClick={() => handleUpdateRoastStatus(roast.id, 'done')}
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
                                    onClick={() => handleUpdateRoastStatus(roast.id, 'pending')}
                                  >
                                    Revert to Pending
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text ta="center" py="xl" c="dimmed" fz="sm">
                          No roast items found for this order matching the filter.
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
