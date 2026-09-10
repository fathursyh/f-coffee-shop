import {
  ActionIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Drawer,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconCalendarCheck,
  IconCoffee,
  IconMinus,
  IconPlus,
  IconShoppingBag,
} from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import { toast } from 'sonner'
import type { CartItem } from './order_catalog'

interface OrderDrawerProps {
  opened: boolean
  onClose: () => void
  cart: CartItem[]
  cartSubtotal: number
  onUpdateQuantity: (cartItemId: string, delta: number) => void
  onRemoveItem: (cartItemId: string) => void
  onConfirmOrder: () => void
}

export default function OrderDrawer({
  opened,
  onClose,
  cart,
  cartSubtotal,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
}: OrderDrawerProps) {
  const isMobile = useMediaQuery('(max-width: 48em)')
  const freeShippingThreshold = 45
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal)
  const shippingCost = remainingForFreeShipping > 0 ? 4.99 : 0
  const totalCost = cartSubtotal + shippingCost
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? '100%' : 'md'}
      padding={isMobile ? 'md' : 'lg'}
      title={
        <Group gap="xs">
          <IconShoppingBag size={20} color="var(--mantine-color-coffee-7)" />
          <Text fw={600} c="coffee.9" style={{ fontSize: '1.2rem' }}>
            Your Fresh Roast Order
          </Text>
        </Group>
      }
      styles={{
        header: {
          borderBottom: '1px solid var(--mantine-color-coffee-2)',
          backgroundColor: 'var(--mantine-color-coffee-0)',
        },
        body: {
          backgroundColor: 'var(--mantine-color-coffee-0)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 60px)',
        },
      }}
    >
      <Stack justify="space-between" style={{ height: '100%' }}>
        {/* Items or Empty */}
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {/* Free shipping counter banner */}
          <Paper
            p="sm"
            radius="md"
            bg="white"
            mb="md"
            style={{
              border: '1px solid var(--mantine-color-coffee-2)',
              boxShadow: 'none',
            }}
          >
            <Group justify="space-between" mb={6}>
              <Text size="xs" fw={600} c="coffee.9">
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`
                  : '🎉 You unlocked Free Nationwide Shipping!'}
              </Text>
              <Text size="xs" c="dimmed">
                ${cartSubtotal.toFixed(2)} / ${freeShippingThreshold}
              </Text>
            </Group>
            <Progress
              value={freeShippingProgress}
              color="coffee"
              size="xs"
              radius="xl"
              styles={{
                section: {
                  backgroundColor: 'var(--mantine-color-coffee-7)',
                },
              }}
            />
          </Paper>

          {cart.length === 0 ? (
            <Center py={64}>
              <Stack align="center" gap="xs">
                <ThemeIcon size={52} radius="xl" color="coffee" variant="light">
                  <IconCoffee size={28} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="coffee.9">
                  Your coffee bag is empty
                </Text>
                <Text size="xs" c="dimmed" ta="center" maw={240}>
                  Choose an origin above, pick your grind, and we&apos;ll roast it fresh for you.
                </Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap="sm">
              {cart.map((item) => (
                <Paper
                  key={item.id}
                  p="sm"
                  radius="md"
                  bg="white"
                  style={{
                    border: '1px solid var(--mantine-color-coffee-2)',
                    boxShadow: 'none',
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={700} c="coffee.9">
                        {item.name}
                      </Text>
                      <Text size="xs" c="coffee.7">
                        {item.origin} • {item.roast} • {item.weight}
                      </Text>
                      <Text size="xs" c="coffee.6" mt={2}>
                        {item.grind}
                      </Text>
                    </Box>

                    <CloseButton
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    />
                  </Group>

                  <Divider my="xs" color="coffee.1" />

                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Box>
                      <Text size="xs" c="coffee.6">
                        ${item.price.toFixed(2)} / pouch
                      </Text>
                      <Text size="sm" fw={700} c="coffee.9">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Box>

                    <Group
                      gap={2}
                      style={{
                        border: '1px solid var(--mantine-color-coffee-2)',
                        borderRadius: 'var(--mantine-radius-md)',
                        padding: '2px 4px',
                        backgroundColor: 'var(--mantine-color-coffee-0)',
                      }}
                    >
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="coffee"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <IconMinus size={14} />
                      </ActionIcon>
                      <Text
                        size="xs"
                        fw={700}
                        c="coffee.9"
                        px={6}
                        style={{ minWidth: 20, textAlign: 'center' }}
                      >
                        {item.quantity}
                      </Text>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="coffee"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Drawer Bottom Checkout */}
        {cart.length > 0 && (
          <Box
            pt="md"
            pb="calc(env(safe-area-inset-bottom, 0px) + 8px)"
            style={{ borderTop: '1px solid var(--mantine-color-coffee-2)' }}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="coffee.8">
                  Subtotal ({totalItems} pouches)
                </Text>
                <Text size="sm" fw={600} c="coffee.9">
                  ${cartSubtotal.toFixed(2)}
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="coffee.8">
                  Shipping
                </Text>
                <Text size="sm" fw={600} c="coffee.9">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </Text>
              </Group>

              <Divider color="coffee.2" my={2} />

              <Group justify="space-between">
                <Text fw={700} size="md" c="coffee.9">
                  Estimated Total
                </Text>
                <Text fw={700} size="lg" c="coffee.9">
                  ${totalCost.toFixed(2)}
                </Text>
              </Group>

              <Paper
                p="xs"
                radius="sm"
                bg="coffee.1"
                style={{ border: '1px solid var(--mantine-color-coffee-2)' }}
              >
                <Group gap={6} wrap="nowrap">
                  <IconCalendarCheck size={16} color="var(--mantine-color-coffee-7)" />
                  <Text size="xs" c="coffee.7">
                    Roasted & shipped within 48 hours. Fresh to your door in peak flavor!
                  </Text>
                </Group>
              </Paper>

              <Button
                fullWidth
                size="md"
                color="coffee"
                mt="xs"
                onClick={() => {
                  onConfirmOrder()
                  toast.success(
                    'Roastery order received! We will begin roasting your custom batch on Thursday.'
                  )
                  onClose()
                }}
              >
                Confirm Fresh Roast Order
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Drawer>
  )
}
