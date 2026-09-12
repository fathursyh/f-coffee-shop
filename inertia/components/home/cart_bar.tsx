import { Box, Button, Group, Paper, Text, ThemeIcon } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import classes from './cart_bar.module.css'

interface CartBarProps {
  totalCount: number
  subtotal: number
  onCheckout: () => void
}

export default function CartBar({ totalCount, subtotal, onCheckout }: CartBarProps) {
  return (
    <Box className={classes.wrapper}>
      <Paper
        p={{ base: 'xs', sm: 'md' }}
        radius="xl"
        bg="coffee.9"
        c="white"
        className={classes.pill}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              size={34}
              radius="xl"
              color="coffee.7"
              variant="filled"
              className={classes.icon}
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
            classNames={{ root: classes.checkoutBtn }}
          >
            Review &amp; Checkout
          </Button>
        </Group>
      </Paper>
    </Box>
  )
}
