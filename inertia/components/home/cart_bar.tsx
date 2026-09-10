import { Box, Button, Group, Paper, Text, ThemeIcon } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import type { CartItem } from './order_catalog'

interface CartBarProps {
  totalCount: number
  subtotal: number
  onCheckout: () => void
}

export default function CartBar({ totalCount, subtotal, onCheckout }: CartBarProps) {
  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 24,
        left: 0,
        right: 0,
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <Paper
        p="md"
        radius="xl"
        bg="coffee.9"
        c="white"
        style={{
          pointerEvents: 'auto',
          boxShadow: '0 12px 32px rgba(50, 30, 16, 0.35)',
          border: '1px solid var(--mantine-color-coffee-6)',
          minWidth: 320,
          maxWidth: 540,
          width: '100%',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size={36} radius="xl" color="coffee.7" variant="filled">
              <IconShoppingBag size={18} color="white" />
            </ThemeIcon>
            <Box>
              <Text size="xs" c="coffee.2">
                {totalCount} {totalCount === 1 ? 'pouch' : 'pouches'} in your bag
              </Text>
              <Text size="sm" fw={700} c="white">
                Order Total: ${subtotal.toFixed(2)}
              </Text>
            </Box>
          </Group>

          <Button
            size="sm"
            color="coffee.5"
            c="coffee.9"
            radius="xl"
            onClick={onCheckout}
            style={{
              backgroundColor: 'var(--mantine-color-coffee-1)',
              fontWeight: 700,
            }}
          >
            Review Order & Checkout
          </Button>
        </Group>
      </Paper>
    </Box>
  )
}
