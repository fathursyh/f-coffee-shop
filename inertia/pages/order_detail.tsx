import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  CopyButton,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Stepper,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBan,
  IconCheck,
  IconClock,
  IconCopy,
  IconCreditCard,
  IconFlame,
  IconMapPin,
  IconPackage,
  IconTruck,
} from '@tabler/icons-react'

export type OrderItemData = {
  id: number
  orderId: number
  coffeeId?: string
  coffeeName: string
  weight: string
  grind: string
  roastType: string
  quantity: number
  unitPrice: number | string
  subtotal: number | string
}

export type PaymentData = {
  id: number
  status: 'PAID' | 'UNPAID' | string
  totalPrice: number | string
  paidAt?: string | null
  paymentLink?: string | null
}

export type OrderDetailData = {
  id: number | string
  userId: number
  subtotal: number | string
  shippingCost: number | string
  totalAmount: number | string
  status: 'PENDING' | 'ROASTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string
  shippingAddress: string
  shippingCity: string
  shippingCountry: string
  shippingPostCode: string
  shippingPhone: string
  courierName?: string | null
  trackingNumber?: string | null
  roastDate?: string | null
  createdAt: string
  updatedAt?: string | null
  items: OrderItemData[]
  payment?: PaymentData | null
}

export type OrderDetailProps = {
  order: OrderDetailData
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [isCancelling, setIsCancelling] = useState(false)
  const [isSimulatingPay, setIsSimulatingPay] = useState(false)

  const isPaid = order.payment?.status === 'PAID'
  const isPending = order.status === 'PENDING'
  const isCancelled = order.status === 'CANCELLED'

  const getActiveStep = () => {
    switch (order.status) {
      case 'PENDING':
        return 0
      case 'ROASTING':
        return 1
      case 'SHIPPED':
        return 2
      case 'DELIVERED':
        return 3
      default:
        return 0
    }
  }

  const handleCancelOrder = () => {
    if (!window.confirm('Are you sure you want to cancel this order? Your reserved coffee beans will be returned to stock.')) {
      return
    }
    setIsCancelling(true)
    router.post(`/orders/${order.id}/cancel`, {}, {
      onFinish: () => setIsCancelling(false),
    })
  }

  const handleSimulatePayment = () => {
    setIsSimulatingPay(true)
    router.post(`/payments/${order.id}/simulate-pay`, {}, {
      onFinish: () => setIsSimulatingPay(false),
    })
  }

  return (
    <Box bg="coffee.0" py={{ base: 'md', sm: 'xl' }} style={{ minHeight: '100dvh' }}>
      <Container size="lg">
        <Stack gap="lg">
          {/* Header navigation */}
          <Group justify="space-between" align="center" wrap="wrap">
            <Button
              component={Link}
              route="orders.index"
              variant="subtle"
              color="coffee"
              size="sm"
              leftSection={<IconArrowLeft size={16} />}
            >
              Back to All Orders
            </Button>

            <Group gap="xs">
              <Badge
                size="lg"
                color={
                  order.status === 'DELIVERED'
                    ? 'teal'
                    : order.status === 'SHIPPED'
                      ? 'blue'
                      : order.status === 'ROASTING'
                        ? 'orange'
                        : order.status === 'CANCELLED'
                          ? 'red'
                          : 'yellow'
                }
                variant="filled"
              >
                {order.status}
              </Badge>
              <Badge size="lg" color={isPaid ? 'teal' : 'red'} variant="outline">
                {isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
              </Badge>
            </Group>
          </Group>

          {/* Cancelled Alert if applicable */}
          {isCancelled && (
            <Alert
              icon={<IconBan size={18} />}
              title="Order Cancelled"
              color="red"
              radius="md"
              variant="light"
            >
              This order was cancelled. Reserved coffee stock has been returned to roastery inventory.
            </Alert>
          )}

          {/* Progress Timeline Stepper */}
          {!isCancelled && (
            <Paper p="lg" radius="md" bg="white" withBorder shadow="xs">
              <Title order={4} c="coffee.9" mb="lg">
                Fulfillment &amp; Delivery Progress
              </Title>
              <Stepper
                active={getActiveStep()}
                color="coffee"
                size="sm"
              >
                <Stepper.Step
                  label="Order Placed"
                  description={new Date(order.createdAt).toLocaleDateString()}
                  icon={<IconClock size={16} />}
                />
                <Stepper.Step
                  label="Roasting"
                  description={
                    order.roastDate
                      ? `Roast: ${new Date(order.roastDate).toLocaleDateString()}`
                      : 'Small-batch roasting'
                  }
                  icon={<IconFlame size={16} />}
                />
                <Stepper.Step
                  label="Shipped"
                  description={order.courierName ? `${order.courierName}` : 'In transit'}
                  icon={<IconTruck size={16} />}
                />
                <Stepper.Step
                  label="Delivered"
                  description="To your door"
                  icon={<IconCheck size={16} />}
                />
              </Stepper>
            </Paper>
          )}

          {/* Courier & Tracking Card (if shipped) */}
          {order.trackingNumber && (
            <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid var(--mantine-color-blue-2)' }}>
              <Group justify="space-between" align="center" wrap="wrap">
                <Group gap="sm">
                  <ThemeIcon color="blue" size="lg" radius="md">
                    <IconTruck size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="blue.8" fw={700} tt="uppercase">
                      Dispatched Courier
                    </Text>
                    <Text fw={700} size="md" c="blue.9">
                      {order.courierName || 'Courier Partner'}
                    </Text>
                  </Box>
                </Group>

                <Group gap="xs">
                  <Box ta={{ base: 'left', sm: 'right' }}>
                    <Text size="xs" c="dimmed">
                      Tracking Number
                    </Text>
                    <Text fw={700} size="sm" c="blue.9">
                      {order.trackingNumber}
                    </Text>
                  </Box>
                  <CopyButton value={order.trackingNumber}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied' : 'Copy Tracking Number'}>
                        <Button
                          size="xs"
                          variant="light"
                          color={copied ? 'teal' : 'blue'}
                          onClick={copy}
                          leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        >
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </Group>
            </Paper>
          )}

          {/* Order Details Grid */}
          <Grid gap="md">
            {/* Left: Ordered Items Invoice */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper p="lg" radius="md" bg="white" withBorder shadow="xs">
                <Group justify="space-between" mb="md">
                  <Title order={4} c="coffee.9">
                    Order Items (#{order.id})
                  </Title>
                  <Text size="xs" c="dimmed">
                    {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                  </Text>
                </Group>

                <Table.ScrollContainer minWidth={500}>
                  <Table verticalSpacing="sm">
                    <Table.Thead bg="coffee.0">
                      <Table.Tr>
                        <Table.Th>Coffee Pouch</Table.Th>
                        <Table.Th>Grind / Roast</Table.Th>
                        <Table.Th ta="center">Qty</Table.Th>
                        <Table.Th ta="right">Price</Table.Th>
                        <Table.Th ta="right">Total</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {order.items?.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <ThemeIcon color="coffee" variant="light" size="md" radius="md">
                                <IconPackage size={16} />
                              </ThemeIcon>
                              <Box>
                                <Text fw={600} size="sm" c="coffee.9">
                                  {item.coffeeName}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {item.weight} pouch
                                </Text>
                              </Box>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs" fw={500} c="coffee.8">
                              {item.grind}
                            </Text>
                            <Badge size="xs" variant="light" color="coffee">
                              {item.roastType}
                            </Badge>
                          </Table.Td>
                          <Table.Td ta="center">
                            <Text size="sm" fw={600}>
                              {item.quantity}
                            </Text>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Text size="sm">
                              ${Number(item.unitPrice).toFixed(2)}
                            </Text>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Text size="sm" fw={700} c="coffee.9">
                              ${Number(item.subtotal).toFixed(2)}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>

                <Divider my="md" />

                {/* Subtotals & Total */}
                <Stack gap={6} align="flex-end">
                  <Group justify="space-between" w={{ base: '100%', sm: 260 }}>
                    <Text size="sm" c="dimmed">
                      Subtotal:
                    </Text>
                    <Text size="sm" fw={600}>
                      ${Number(order.subtotal || order.totalAmount).toFixed(2)}
                    </Text>
                  </Group>

                  <Group justify="space-between" w={{ base: '100%', sm: 260 }}>
                    <Text size="sm" c="dimmed">
                      Fresh Roast Delivery:
                    </Text>
                    <Text size="sm" fw={600} c={Number(order.shippingCost) === 0 ? 'teal' : undefined}>
                      {Number(order.shippingCost) === 0 ? 'FREE' : `$${Number(order.shippingCost).toFixed(2)}`}
                    </Text>
                  </Group>

                  <Divider my={4} w={{ base: '100%', sm: 260 }} />

                  <Group justify="space-between" w={{ base: '100%', sm: 260 }}>
                    <Text size="md" fw={700} c="coffee.9">
                      Grand Total:
                    </Text>
                    <Text size="lg" fw={800} c="coffee.9">
                      ${Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Right: Shipping & Payment Actions */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                {/* Shipping Destination */}
                <Paper p="md" radius="md" bg="white" withBorder shadow="xs">
                  <Group gap="xs" mb="xs">
                    <ThemeIcon color="coffee" variant="light" size="sm">
                      <IconMapPin size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="sm" c="coffee.9">
                      Delivery Address
                    </Text>
                  </Group>

                  <Text size="sm" c="coffee.9" fw={500}>
                    {order.shippingAddress}
                  </Text>
                  <Text size="sm" c="coffee.8">
                    {order.shippingCity}, {order.shippingCountry} {order.shippingPostCode}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    Recipient Phone: {order.shippingPhone}
                  </Text>
                </Paper>

                {/* Payment Simulation / Action */}
                <Paper p="md" radius="md" bg="white" withBorder shadow="xs">
                  <Group gap="xs" mb="xs">
                    <ThemeIcon color={isPaid ? 'teal' : 'orange'} variant="light" size="sm">
                      <IconCreditCard size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="sm" c="coffee.9">
                      Payment Status
                    </Text>
                  </Group>

                  <Text size="sm" c={isPaid ? 'teal.8' : 'orange.8'} fw={600} mb="xs">
                    {isPaid ? 'Fully Paid & Confirmed' : 'Payment Awaiting Settlement'}
                  </Text>

                  {isPaid && order.payment?.paidAt && (
                    <Text size="xs" c="dimmed" mb="sm">
                      Paid on: {new Date(order.payment.paidAt).toLocaleString()}
                    </Text>
                  )}

                  {!isPaid && (
                    <Stack gap="xs" mt="sm">
                      <Button
                        color="teal"
                        fullWidth
                        size="sm"
                        loading={isSimulatingPay}
                        onClick={handleSimulatePayment}
                        leftSection={<IconCheck size={16} />}
                      >
                        Simulate Payment (Dev Mode)
                      </Button>
                      <Text size="11px" c="dimmed" ta="center">
                        Quickly mark order as paid to queue for roasting.
                      </Text>
                    </Stack>
                  )}
                </Paper>

                {/* Cancel Order Action (if PENDING) */}
                {isPending && (
                  <Paper p="md" radius="md" bg="white" withBorder shadow="xs">
                    <Text fw={700} size="sm" c="coffee.9" mb="xs">
                      Order Management
                    </Text>
                    <Text size="xs" c="dimmed" mb="md">
                      Need to make changes? You can cancel your order while it is still pending roasting.
                    </Text>
                    <Button
                      color="red"
                      variant="light"
                      fullWidth
                      size="sm"
                      loading={isCancelling}
                      onClick={handleCancelOrder}
                      leftSection={<IconBan size={16} />}
                    >
                      Cancel Order
                    </Button>
                  </Paper>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}
