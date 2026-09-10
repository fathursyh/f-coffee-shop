import { Box, Button, Group, Paper, Text, ThemeIcon } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'

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
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        left: 0,
        right: 0,
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 12px',
        pointerEvents: 'none',
      }}
    >
      <Paper
        p={{ base: 'xs', sm: 'md' }}
        radius="xl"
        bg="coffee.9"
        c="white"
        style={{
          pointerEvents: 'auto',
          boxShadow: '0 12px 32px rgba(50, 30, 16, 0.35)',
          border: '1px solid var(--mantine-color-coffee-6)',
          maxWidth: 540,
          width: '100%',
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              size={34}
              radius="xl"
              color="coffee.7"
              variant="filled"
              style={{ flexShrink: 0 }}
            >
              <IconShoppingBag size={18} color="white" />
            </ThemeIcon>
            <Box>
              <Text size="xs" c="coffee.2" truncate>
                {totalCount} {totalCount === 1 ? 'pouch' : 'pouches'} in bag
              </Text>
              <Text size="sm" fw={700} c="white">
                Total: ${subtotal.toFixed(2)}
              </Text>
            </Box>
          </Group>

          <Button
            size="sm"
            color="coffee.5"
            c="coffee.9"
            radius="xl"
            px={{ base: 14, sm: 20 }}
            onClick={onCheckout}
            style={{
              backgroundColor: 'var(--mantine-color-coffee-1)',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            Review & Checkout
          </Button>
        </Group>
      </Paper>
    </Box>
  )
}
