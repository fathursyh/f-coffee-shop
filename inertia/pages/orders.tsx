import { Link } from '@adonisjs/inertia/react'
import {
  IconArrowLeft,
  IconClock,
  IconTruck,
  IconCheck,
  IconPackage,
  IconMapPin,
  IconCreditCard,
  IconChevronRight,
  IconShoppingBag,
} from '@tabler/icons-react'
import {
  Container,
  Badge,
  Group,
  Button,
  Title,
  Stack,
  Text,
  Paper,
  Divider,
  SimpleGrid,
  ThemeIcon,
} from '@mantine/core'

type OrderItem = {
  id: number
  coffeeName: string
  quantity: number
  weight: string
  grind: string
  roastType: string
  unitPrice: string | number
  subtotal: string | number
}

type Order = {
  id: string | number
  totalAmount: number | string
  subtotal?: number | string
  shippingCost?: number | string
  status: 'PENDING' | 'ROASTING' | 'SHIPPED' | 'DELIVERED' | string
  createdAt: string
  shippingAddress: string
  shippingCity: string
  shippingCountry: string
  payment?: {
    status: 'PAID' | 'UNPAID' | string
    paidAt?: string
    paymentLink?: string | null
  }
  items?: OrderItem[]
}

type OrdersPageProps = {
  orders: Order[]
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <IconClock size={14} />
      case 'ROASTING':
        return <IconPackage size={14} />
      case 'SHIPPED':
        return <IconTruck size={14} />
      case 'DELIVERED':
        return <IconCheck size={14} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'yellow'
      case 'ROASTING':
        return 'orange'
      case 'SHIPPED':
        return 'blue'
      case 'DELIVERED':
        return 'teal'
      default:
        return 'gray'
    }
  }

  return (
    <Container size="md" py={{ base: 'md', sm: 'xl' }} px={{ base: 'sm', sm: 'md' }}>
      <Stack gap="lg">
        {/* Page Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} fw={700}>
              My Orders
            </Title>
            <Text c="dimmed" size="sm">
              Track and manage your recent coffee purchases
            </Text>
          </div>
          <Button
            component={Link}
            route="home"
            variant="light"
            size="sm"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Shop
          </Button>
        </Group>

        {/* Empty State */}
        {orders.length === 0 ? (
          <Paper withBorder radius="md" p={{ base: 'xl', sm: 50 }} ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="brown" mx="auto" mb="md">
              <IconShoppingBag size={32} />
            </ThemeIcon>
            <Title order={3} fw={600} mb="xs">
              No orders found
            </Title>
            <Text c="dimmed" size="sm" maw={380} mx="auto" mb="lg">
              Looks like you haven&apos;t ordered any fresh beans yet. Explore our roast profiles!
            </Text>
            <Button component={Link} route="home" size="md">
              Browse Coffee
            </Button>
          </Paper>
        ) : (
          /* Order Cards List */
          <Stack gap="md">
            {orders.map((order) => {
              const isPaid = order.payment?.status === 'PAID'

              return (
                <Paper
                  key={order.id}
                  withBorder
                  radius="md"
                  p={{ base: 'md', sm: 'lg' }}
                  shadow="xs"
                >
                  {/* Card Header: ID, Date & Badges */}
                  <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
                    <div>
                      <Group gap="xs" align="center">
                        <Text fw={700} size="md">
                          Order #{order.id}
                        </Text>
                        <Text c="dimmed" size="xs">
                          •{' '}
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </Group>
                    </div>

                    <Group gap="xs">
                      <Badge
                        leftSection={getStatusIcon(order.status)}
                        color={getStatusColor(order.status)}
                        variant="light"
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                      <Badge color={isPaid ? 'teal' : 'red'} variant="dot" size="sm">
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </Group>
                  </Group>

                  <Divider my="sm" />

                  {/* Item Preview (if items relation is passed from controller) */}
                  {order.items && order.items.length > 0 && (
                    <Stack gap="xs" mb="sm">
                      {order.items.map((item) => (
                        <Group
                          key={item.id}
                          justify="space-between"
                          align="flex-start"
                          wrap="nowrap"
                        >
                          <Group gap="xs" wrap="nowrap">
                            <ThemeIcon variant="subtle" color="gray" size="sm">
                              <IconPackage size={14} />
                            </ThemeIcon>
                            <div>
                              <Text size="sm" fw={500} lineClamp={1}>
                                {item.coffeeName}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {item.weight} • {item.grind} • Qty: {item.quantity}
                              </Text>
                            </div>
                          </Group>
                          <Text size="sm" fw={600}>
                            ${Number(item.subtotal || item.unitPrice).toFixed(2)}
                          </Text>
                        </Group>
                      ))}
                      <Divider my="xs" variant="dashed" />
                    </Stack>
                  )}

                  {/* Summary & Shipping Details */}
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" py="xs">
                    <Group gap="xs" align="flex-start">
                      <ThemeIcon variant="light" color="gray" size="sm" mt={2}>
                        <IconMapPin size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Shipping Address
                        </Text>
                        <Text size="sm" fw={500}>
                          {order.shippingAddress}, {order.shippingCity}, {order.shippingCountry}
                        </Text>
                      </div>
                    </Group>

                    <Group gap="xs" align="flex-start">
                      <ThemeIcon
                        variant="light"
                        color={isPaid ? 'teal' : 'orange'}
                        size="sm"
                        mt={2}
                      >
                        <IconCreditCard size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Payment Info
                        </Text>
                        <Text size="sm" fw={500}>
                          {isPaid
                            ? `Paid on ${order.payment?.paidAt ? new Date(order.payment.paidAt).toLocaleDateString() : 'N/A'}`
                            : 'Awaiting Payment'}
                        </Text>
                      </div>
                    </Group>
                  </SimpleGrid>

                  <Divider my="sm" />

                  {/* Card Footer: Total Price & Actions */}
                  <Group justify="space-between" align="center" wrap="wrap" gap="sm">
                    <div>
                      <Text size="xs" c="dimmed">
                        Total Amount
                      </Text>
                      <Text size="lg" fw={700} c="brand">
                        ${Number(order.totalAmount).toFixed(2)}
                      </Text>
                    </div>

                    <Group gap="xs">
                      {!isPaid && order.payment?.paymentLink && (
                        <Button
                          component="a"
                          href={order.payment.paymentLink}
                          size="xs"
                          color="orange"
                          variant="filled"
                        >
                          Pay Now
                        </Button>
                      )}

                      <Button
                        component={Link}
                        route="home"
                        params={{ id: order.id }}
                        variant="light"
                        size="xs"
                        rightSection={<IconChevronRight size={14} />}
                      >
                        Details
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
