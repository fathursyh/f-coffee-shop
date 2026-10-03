import { useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconClock,
  IconCoffee,
  IconDroplet,
  IconFlame,
  IconMinus,
  IconPlus,
  IconScale,
  IconShieldCheck,
} from '@tabler/icons-react'
import useCart from '~/hooks/use_cart'
import CartBar from '~/components/home/cart_bar'
import OrderDrawer from '~/components/home/order_drawer'
import { GRIND_OPTIONS, type BeanSelection } from '~/components/home/order_catalog'
import type Cart from '#models/cart'
import type Coffee from '#models/coffee'

interface CoffeeDetailProps {
  coffee: Coffee
  dbCart?: Cart[]
}

const getBeanPrice = (basePrice: number = 0, weight: '250g' | '500g' | '1kg'): number => {
  switch (weight) {
    case '500g':
      return +(basePrice * 1.88).toFixed(2)
    case '1kg':
      return +(basePrice * 3.5).toFixed(2)
    default:
      return +basePrice.toFixed(2)
  }
}

export default function CoffeeDetail({ coffee, dbCart = [] }: CoffeeDetailProps) {
  const {
    cart,
    cartSubtotal,
    totalCartCount,
    drawerOpened,
    setDrawerOpened,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleConfirmOrder,
    handleCheckout,
  } = useCart(dbCart)

  const [weight, setWeight] = useState<'250g' | '500g' | '1kg'>('250g')
  const [grind, setGrind] = useState<string>('whole-bean')
  const [quantity, setQuantity] = useState<number>(1)

  const basePrice = Number(coffee.basePrice250G ?? 0)
  const unitPrice = getBeanPrice(basePrice, weight)
  const isOutOfStock = coffee.stockQuantity !== undefined && coffee.stockQuantity <= 0
  const tastingNotes = Array.isArray(coffee.tastingNotes) ? coffee.tastingNotes : []

  const handleAdd = () => {
    if (isOutOfStock) return
    const selection: BeanSelection = {
      weight,
      grind,
      quantity,
    }
    handleAddToCart(coffee, selection)
  }

  return (
    <Box bg="coffee.0" py={{ base: 'md', md: 'xl' }} style={{ minHeight: '100dvh' }}>
      <Container size="xl">
        {/* Navigation Breadcrumb */}
        <Group justify="space-between" mb="lg">
          <Button
            component={Link}
            route="home"
            variant="subtle"
            color="coffee"
            size="sm"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Coffee Menu
          </Button>

          <Group gap="xs">
            <Badge variant="outline" color="coffee" size="sm">
              Single-Origin Specialty
            </Badge>
            {coffee.badge && (
              <Badge color="coffee" variant="filled" size="sm">
                {coffee.badge}
              </Badge>
            )}
          </Group>
        </Group>

        {/* Product Overview Grid */}
        <Grid gap={{ base: 'lg', md: 'xl' }}>
          {/* Left Column: Media & Brewing Guides */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              {/* Product Hero Image */}
              <Card radius="lg" p={0} withBorder bg="white" style={{ overflow: 'hidden' }}>
                <Box pos="relative">
                  <Image
                    src={
                      coffee.imageUrl ||
                      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={coffee.name}
                    h={{ base: 280, sm: 380, md: 420 }}
                    fit="cover"
                    fallbackSrc="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80"
                  />
                  <Box
                    pos="absolute"
                    top={16}
                    left={16}
                    style={{ zIndex: 2, display: 'flex', gap: 8 }}
                  >
                    <Badge size="lg" color="coffee" variant="filled">
                      {coffee.roast} Roast
                    </Badge>
                    {isOutOfStock && (
                      <Badge size="lg" color="red" variant="filled">
                        Out of Stock
                      </Badge>
                    )}
                  </Box>
                </Box>
              </Card>

              {/* Terroir & Origin Specifications */}
              <Paper p="lg" radius="md" bg="white" withBorder>
                <Title order={4} c="coffee.9" mb="md">
                  Terroir &amp; Farm Profile
                </Title>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Country
                    </Text>
                    <Text size="sm" fw={600} c="coffee.9">
                      {coffee.origin}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Subregion
                    </Text>
                    <Text size="sm" fw={600} c="coffee.9">
                      {coffee.subregion || 'Specialty Lot'}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Elevation
                    </Text>
                    <Text size="sm" fw={600} c="coffee.9">
                      {coffee.elevation || '1,800+ MASL'}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Process
                    </Text>
                    <Text size="sm" fw={600} c="coffee.9">
                      {coffee.process || 'Washed'}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Paper>

              {/* Recommended Brewing Methods */}
              <Paper p="lg" radius="md" bg="white" withBorder>
                <Title order={4} c="coffee.9" mb="sm">
                  Recommended Brew Recipes
                </Title>
                <Text size="xs" c="dimmed" mb="md">
                  Dialed in by our head roaster to unlock peak aromatics and sweetness.
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <Paper p="sm" radius="md" bg="coffee.0">
                    <Group gap="xs" mb={4}>
                      <ThemeIcon size="xs" color="coffee" variant="transparent">
                        <IconDroplet size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="coffee.9">
                        Pour Over (V60 / Chemex)
                      </Text>
                    </Group>
                    <Text size="11px" c="coffee.7">
                      Ratio 1:16 (15g coffee / 240g water) • 93°C • 3:00 min total draw down
                    </Text>
                  </Paper>

                  <Paper p="sm" radius="md" bg="coffee.0">
                    <Group gap="xs" mb={4}>
                      <ThemeIcon size="xs" color="coffee" variant="transparent">
                        <IconCoffee size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="coffee.9">
                        AeroPress (Inverted)
                      </Text>
                    </Group>
                    <Text size="11px" c="coffee.7">
                      Ratio 1:14 (17g coffee / 240g water) • 88°C • 1:30 steep, 30s gentle press
                    </Text>
                  </Paper>

                  <Paper p="sm" radius="md" bg="coffee.0">
                    <Group gap="xs" mb={4}>
                      <ThemeIcon size="xs" color="coffee" variant="transparent">
                        <IconFlame size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="coffee.9">
                        Espresso &amp; Moka Pot
                      </Text>
                    </Group>
                    <Text size="11px" c="coffee.7">
                      18.5g in • 38g liquid yield • 27-29 seconds extraction at 9 bars
                    </Text>
                  </Paper>

                  <Paper p="sm" radius="md" bg="coffee.0">
                    <Group gap="xs" mb={4}>
                      <ThemeIcon size="xs" color="coffee" variant="transparent">
                        <IconScale size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="coffee.9">
                        Cold Brew Immersion
                      </Text>
                    </Group>
                    <Text size="11px" c="coffee.7">
                      Ratio 1:8 coarse grind • Cold filtered water • 16-18h steep in fridge
                    </Text>
                  </Paper>
                </SimpleGrid>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Right Column: Buying Options & Details */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              {/* Product Header */}
              <Box>
                <Group gap="xs" mb={4}>
                  <Badge variant="light" color="coffee" size="sm" leftSection={<IconFlame size={12} />}>
                    {coffee.roast} Roast (Level {coffee.roastLevel}/5)
                  </Badge>
                  {coffee.stockQuantity !== undefined && (
                    <Badge
                      variant="outline"
                      color={isOutOfStock ? 'red' : coffee.stockQuantity < 15 ? 'orange' : 'teal'}
                      size="sm"
                    >
                      {isOutOfStock
                        ? 'Out of Stock'
                        : `${coffee.stockQuantity} bags in stock`}
                    </Badge>
                  )}
                </Group>

                <Title order={1} c="coffee.9" fz={{ base: '1.75rem', sm: '2.25rem' }}>
                  {coffee.name}
                </Title>
                <Text size="sm" fw={600} c="coffee.6" mt={2}>
                  {coffee.subregion ? `${coffee.subregion} · ` : ''}
                  {coffee.origin}
                </Text>
              </Box>

              {/* Price Display */}
              <Paper p="md" radius="md" bg="white" withBorder>
                <Group justify="space-between" align="center">
                  <Box>
                    <Text size="xs" c="dimmed">
                      Price for {weight} pouch
                    </Text>
                    <Text fw={800} size="xl" c="coffee.9" fz="1.75rem">
                      ${(unitPrice * quantity).toFixed(2)}
                    </Text>
                  </Box>

                  <Badge variant="dot" color="teal" size="md">
                    Roasted Fresh Weekly
                  </Badge>
                </Group>
              </Paper>

              {/* Tasting Notes */}
              {tastingNotes.length > 0 && (
                <Box>
                  <Text size="xs" fw={700} c="coffee.7" tt="uppercase" mb="xs">
                    Cupping Notes &amp; Aroma
                  </Text>
                  <Group gap="xs" wrap="wrap">
                    {tastingNotes.map((note) => (
                      <Badge
                        key={note}
                        size="md"
                        variant="light"
                        color="coffee"
                        radius="md"
                        px="md"
                        py="sm"
                      >
                        {note}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              )}

              {/* Flavor Profile Description */}
              {coffee.description && (
                <Paper p="md" radius="md" bg="white" withBorder>
                  <Text size="xs" fw={700} c="coffee.7" tt="uppercase" mb={4}>
                    Roaster&apos;s Notes
                  </Text>
                  <Text size="sm" c="coffee.8" style={{ lineHeight: 1.65 }}>
                    {coffee.description}
                  </Text>
                </Paper>
              )}

              <Divider color="coffee.2" />

              {/* Purchase Customization Box */}
              <Paper p="lg" radius="md" bg="white" withBorder shadow="sm">
                <Stack gap="md">
                  {/* Pouch Weight */}
                  <Box>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" fw={700} c="coffee.9">
                        SELECT POUCH SIZE
                      </Text>
                      <Text size="xs" c="dimmed">
                        {weight === '250g'
                          ? '~16-18 cups'
                          : weight === '500g'
                            ? '~32-36 cups (Save 6%)'
                            : '~70 cups (Save 12%)'}
                      </Text>
                    </Group>
                    <SegmentedControl
                      fullWidth
                      color="coffee"
                      radius="md"
                      value={weight}
                      onChange={(val) => setWeight(val as '250g' | '500g' | '1kg')}
                      data={[
                        { label: '250g Pouch', value: '250g' },
                        { label: '500g (-6%)', value: '500g' },
                        { label: '1kg (-12%)', value: '1kg' },
                      ]}
                    />
                  </Box>

                  {/* Grind Selector */}
                  <Box>
                    <Text size="xs" fw={700} c="coffee.9" mb={4}>
                      GRIND METHOD
                    </Text>
                    <Select
                      value={grind}
                      onChange={(val) => setGrind(val || 'whole-bean')}
                      data={GRIND_OPTIONS}
                      radius="md"
                      checkIconPosition="right"
                    />
                  </Box>

                  {/* Quantity & Add to Cart */}
                  <Group justify="space-between" align="center" mt="sm">
                    <Box>
                      <Text size="xs" c="dimmed" mb={2}>
                        Quantity
                      </Text>
                      <Group gap={4}>
                        <ActionIcon
                          size="md"
                          variant="default"
                          color="coffee"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={isOutOfStock || quantity <= 1}
                        >
                          <IconMinus size={16} />
                        </ActionIcon>
                        <Text fw={700} size="sm" px="sm" c="coffee.9">
                          {quantity}
                        </Text>
                        <ActionIcon
                          size="md"
                          variant="default"
                          color="coffee"
                          onClick={() => setQuantity((q) => q + 1)}
                          disabled={
                            isOutOfStock ||
                            (coffee.stockQuantity !== undefined && quantity >= coffee.stockQuantity)
                          }
                        >
                          <IconPlus size={16} />
                        </ActionIcon>
                      </Group>
                    </Box>

                    <Button
                      size="md"
                      color="coffee"
                      radius="md"
                      disabled={isOutOfStock}
                      onClick={handleAdd}
                      leftSection={isOutOfStock ? undefined : <IconPlus size={18} />}
                      style={{ flex: 1, maxWidth: 280 }}
                    >
                      {isOutOfStock
                        ? 'Out of Stock'
                        : `Add to Bag • $${(unitPrice * quantity).toFixed(2)}`}
                    </Button>
                  </Group>
                </Stack>
              </Paper>

              {/* Guarantees */}
              <SimpleGrid cols={2} spacing="sm">
                <Paper p="sm" radius="md" bg="coffee.0" withBorder>
                  <Group gap="xs" wrap="nowrap">
                    <ThemeIcon color="coffee" variant="light" size="md">
                      <IconClock size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" fw={700} c="coffee.9">
                        Peak Freshness
                      </Text>
                      <Text size="11px" c="coffee.7">
                        Dispatched within 48h of roast
                      </Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper p="sm" radius="md" bg="coffee.0" withBorder>
                  <Group gap="xs" wrap="nowrap">
                    <ThemeIcon color="teal" variant="light" size="md">
                      <IconShieldCheck size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" fw={700} c="coffee.9">
                        Direct Trade
                      </Text>
                      <Text size="11px" c="coffee.7">
                        Ethically sourced directly from origin
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </SimpleGrid>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Floating Cart Bar if any items in cart */}
        {totalCartCount > 0 && (
          <CartBar
            totalCount={totalCartCount}
            subtotal={cartSubtotal}
            onCheckout={handleCheckout}
          />
        )}

        {/* Cart Drawer */}
        <OrderDrawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          cart={cart}
          cartSubtotal={cartSubtotal}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onConfirmOrder={handleConfirmOrder}
        />
      </Container>
    </Box>
  )
}
