import type Coffee from '#models/coffee'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconCoffee, IconMinus, IconPlus } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

export const GRIND_OPTIONS = [
  { value: 'whole-bean', label: 'Whole Bean (Recommended for peak aroma)' },
  { value: 'pour-over', label: 'Pour Over / V60 / Chemex (Medium-Fine)' },
  { value: 'drip-aeropress', label: 'Drip & AeroPress (Medium)' },
  { value: 'espresso', label: 'Espresso & Moka Pot (Fine)' },
  { value: 'french-press', label: 'French Press & Cold Brew (Coarse)' },
]

export interface BeanSelection {
  weight: '250g' | '500g' | '1kg'
  grind: string
  quantity: number
}

interface OrderCatalogProps {
  coffee: Coffee[]
  onAddToCart: (bean: Coffee, selection: BeanSelection) => void
}

export default function OrderCatalog({ coffee, onAddToCart }: OrderCatalogProps) {
  const [selectedRoastFilter, setSelectedRoastFilter] = useState<string>('all')

  const [beanSelections, setBeanSelections] = useState<
    Record<string, { weight: '250g' | '500g' | '1kg'; grind: string; quantity: number }>
  >({
    'guji-highland-flora': { weight: '250g', grind: 'whole-bean', quantity: 1 },
    'finca-la-esperanza': { weight: '250g', grind: 'whole-bean', quantity: 1 },
    'antigua-los-volcanes': { weight: '250g', grind: 'whole-bean', quantity: 1 },
    'sumatra-gayo-mountain': { weight: '250g', grind: 'whole-bean', quantity: 1 },
    'hearthstone-house-blend': { weight: '250g', grind: 'whole-bean', quantity: 1 },
    'cauca-sugarcane-decaf': { weight: '250g', grind: 'whole-bean', quantity: 1 },
  })

  const getBeanPrice = (basePrice: number, weight: '250g' | '500g' | '1kg'): number => {
    switch (weight) {
      case '500g':
        return +(basePrice * 1.88).toFixed(2)
      case '1kg':
        return +(basePrice * 3.5).toFixed(2)
      default:
        return basePrice
    }
  }

  const handleWeightChange = (coffeeId: string, weight: '250g' | '500g' | '1kg') => {
    setBeanSelections((prev) => ({
      ...prev,
      [coffeeId]: {
        ...(prev[coffeeId] || { grind: 'whole-bean', quantity: 1 }),
        weight,
      },
    }))
  }

  const handleGrindChange = (coffeeId: string, grind: string | null) => {
    if (!grind) return
    setBeanSelections((prev) => ({
      ...prev,
      [coffeeId]: {
        ...(prev[coffeeId] || { weight: '250g', quantity: 1 }),
        grind,
      },
    }))
  }

  const handleQuantityChange = (coffeeId: string, delta: number) => {
    setBeanSelections((prev) => {
      const current = prev[coffeeId] || { weight: '250g', grind: 'whole-bean', quantity: 1 }
      const newQty = Math.max(1, current.quantity + delta)
      return {
        ...prev,
        [coffeeId]: {
          ...current,
          quantity: newQty,
        },
      }
    })
  }

  const handleAddToCartClick = (bean: Coffee) => {
    const selection = beanSelections[bean.id] || {
      weight: '250g',
      grind: 'whole-bean',
      quantity: 1,
    }
    onAddToCart(bean, selection)
  }

  const filteredBeans = useMemo(() => {
    if (selectedRoastFilter === 'all') return coffee
    if (selectedRoastFilter === 'light')
      return coffee.filter((b) => b.roast === 'Light' || b.roast === 'Medium-Light')
    if (selectedRoastFilter === 'medium') return coffee.filter((b) => b.roast === 'Medium')
    if (selectedRoastFilter === 'dark')
      return coffee.filter((b) => b.roast === 'Medium-Dark' || b.roast === 'Dark')
    if (selectedRoastFilter === 'single-origin')
      return coffee.filter((b) => !b.name.includes('Blend'))
    return coffee
  }, [coffee, selectedRoastFilter])

  return (
    <Container
      size="xl"
      py={{ base: 64, sm: 80, md: 96 }}
      px={{ base: 'md', sm: 'lg' }}
      id="coffee-menu"
    >
      <Stack gap="xl">
        {/* Header & Filter Row */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'flex-end' }}
          gap="md"
        >
          <Box>
            <Group gap="xs" mb={4}>
              <IconCoffee size={18} color="var(--mantine-color-coffee-6)" />
              <Text
                size="xs"
                fw={700}
                c="coffee.6"
                style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                This Week’s Batch
              </Text>
            </Group>
            <Title order={2} c="coffee.9" fz={{ base: '1.45rem', sm: '1.75rem', md: '1.9rem' }}>
              Order Fresh Whole Bean or Custom Grind
            </Title>
            <Text size="sm" c="coffee.7" mt={4} fz={{ base: 'xs', sm: 'sm' }}>
              Select your preferred pouch weight and brewing method. We grind fresh on an EK43 right
              before packing.
            </Text>
          </Box>

          {/* Filter Pills */}
          <Box
            w={{ base: '100%', md: 'auto' }}
            style={{
              overflowX: 'auto',
              maxWidth: '100%',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <SegmentedControl
              value={selectedRoastFilter}
              onChange={setSelectedRoastFilter}
              color="coffee"
              radius="md"
              size="xs"
              data={[
                { label: 'All Beans (6)', value: 'all' },
                { label: 'Light & Fruity', value: 'light' },
                { label: 'Medium & Sweet', value: 'medium' },
                { label: 'Dark & Bold', value: 'dark' },
                { label: 'Single Origin', value: 'single-origin' },
              ]}
              styles={{
                root: {
                  backgroundColor: 'white',
                  border: '1px solid var(--mantine-color-coffee-2)',
                  padding: 3,
                  minWidth: 'max-content',
                },
                indicator: {
                  backgroundColor: 'var(--mantine-color-coffee-7)',
                },
              }}
            />
          </Box>
        </Flex>

        {/* Coffee Cards Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 'lg', md: 'xl' }}>
          {filteredBeans.map((bean) => {
            const selection = beanSelections[bean.id] || {
              weight: '250g',
              grind: 'whole-bean',
              quantity: 1,
            }
            const basePrice = Number(bean.basePrice250G ?? 0)
            const currentPrice = getBeanPrice(basePrice, selection.weight)
            const tastingNotesList = Array.isArray(bean.tastingNotes) ? bean.tastingNotes : []

            return (
              <Card
                key={bean.id}
                padding="md"
                radius="lg"
                bg="white"
                style={{
                  border: '1px solid var(--mantine-color-coffee-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                }}
              >
                <Stack gap="sm">
                  {/* Card Top Pill & Roast indicator */}
                  <Group justify="space-between" align="center">
                    <Badge
                      variant="light"
                      color="coffee"
                      radius="sm"
                      size="sm"
                      style={{ fontWeight: 600 }}
                    >
                      {bean.roast} Roast
                    </Badge>

                    {bean.badge && (
                      <Badge
                        variant="filled"
                        color="coffee"
                        size="xs"
                        radius="sm"
                        style={{
                          backgroundColor: 'var(--mantine-color-coffee-8)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {bean.badge}
                      </Badge>
                    )}
                  </Group>

                  {/* Title & Origin */}
                  <Box mt={4}>
                    <Title order={3} c="coffee.9" style={{ fontSize: '1.25rem', lineHeight: 1.25 }}>
                      {bean.name}
                    </Title>
                    <Text size="xs" fw={600} c="coffee.6" mt={2}>
                      {bean.subregion ? `${bean.subregion} · ` : ''}
                      {bean.origin}
                    </Text>
                  </Box>

                  {/* Cupping & Terroir Details */}
                  <Paper
                    p="xs"
                    radius="md"
                    bg="coffee.0"
                    style={{
                      border: '1px solid var(--mantine-color-coffee-1)',
                      boxShadow: 'none',
                    }}
                  >
                    <SimpleGrid cols={3} spacing={4}>
                      <Box>
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Elevation
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8" truncate>
                          {bean.elevation || 'N/A'}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          borderLeft: '1px solid var(--mantine-color-coffee-2)',
                          paddingLeft: 6,
                        }}
                      >
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Process
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8" truncate>
                          {bean.process || 'N/A'}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          borderLeft: '1px solid var(--mantine-color-coffee-2)',
                          paddingLeft: 6,
                        }}
                      >
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Best Brew
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8" truncate>
                          {bean.bestFor?.split(',')[0] || 'Any'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Paper>

                  {/* Description */}
                  <Text size="xs" c="coffee.8" style={{ lineHeight: 1.55 }}>
                    {bean.description}
                  </Text>

                  {/* Tasting Notes Tags */}
                  <Box>
                    <Text size="10px" c="coffee.6" fw={700} tt="uppercase" mb={4}>
                      Tasting Notes:
                    </Text>
                    <Group gap={5} wrap="wrap">
                      {tastingNotesList.map((note) => (
                        <Badge
                          key={note}
                          variant="outline"
                          color="coffee"
                          size="xs"
                          radius="md"
                          style={{
                            borderColor: 'var(--mantine-color-coffee-2)',
                            color: 'var(--mantine-color-coffee-8)',
                            backgroundColor: 'var(--mantine-color-coffee-0)',
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {note}
                        </Badge>
                      ))}
                    </Group>
                  </Box>

                  <Divider my={4} color="coffee.1" />

                  {/* Ordering Controls */}
                  <Stack gap="xs">
                    {/* Weight Selector */}
                    <Box>
                      <Group justify="space-between" mb={3}>
                        <Text size="xs" fw={600} c="coffee.9">
                          Pouch Size
                        </Text>
                        <Text size="xs" c="dimmed">
                          {selection.weight === '250g'
                            ? '~16-18 cups'
                            : selection.weight === '500g'
                              ? '~32-36 cups (Save 6%)'
                              : '~70 cups (Save 12%)'}
                        </Text>
                      </Group>
                      <SegmentedControl
                        fullWidth
                        size="xs"
                        color="coffee"
                        radius="md"
                        value={selection.weight}
                        onChange={(val) =>
                          handleWeightChange(bean.id, val as '250g' | '500g' | '1kg')
                        }
                        data={[
                          { label: '250g', value: '250g' },
                          { label: '500g (-6%)', value: '500g' },
                          { label: '1kg (-12%)', value: '1kg' },
                        ]}
                        styles={{
                          root: {
                            backgroundColor: 'var(--mantine-color-coffee-0)',
                            border: '1px solid var(--mantine-color-coffee-2)',
                          },
                        }}
                      />
                    </Box>

                    {/* Grind Selector */}
                    <Box>
                      <Text size="xs" fw={600} c="coffee.9" mb={3}>
                        Grind Method
                      </Text>
                      <Select
                        size="xs"
                        radius="md"
                        value={selection.grind}
                        onChange={(val) => handleGrindChange(bean.id, val)}
                        data={GRIND_OPTIONS}
                        checkIconPosition="right"
                        styles={{
                          input: {
                            backgroundColor: 'var(--mantine-color-coffee-0)',
                            borderColor: 'var(--mantine-color-coffee-2)',
                            fontSize: '12px',
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Stack>

                {/* Card Bottom: Price & Add to Cart */}
                <Box mt="md">
                  <Divider my="xs" color="coffee.1" />
                  <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                    <Box>
                      <Text size="xs" c="dimmed">
                        Subtotal
                      </Text>
                      <Text fw={700} size="lg" c="coffee.9">
                        ${(currentPrice * selection.quantity).toFixed(2)}
                      </Text>
                    </Box>

                    <Group gap={8} align="center">
                      {/* Quantity controls */}
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
                          onClick={() => handleQuantityChange(bean.id, -1)}
                          disabled={selection.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <IconMinus size={14} />
                        </ActionIcon>
                        <Text
                          size="xs"
                          fw={700}
                          c="coffee.9"
                          px={4}
                          style={{ minWidth: 18, textAlign: 'center' }}
                        >
                          {selection.quantity}
                        </Text>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="coffee"
                          onClick={() => handleQuantityChange(bean.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Group>

                      <Button
                        size="xs"
                        color="coffee"
                        radius="md"
                        onClick={() => handleAddToCartClick(bean)}
                        leftSection={<IconPlus size={14} />}
                        style={{
                          height: 32,
                          fontWeight: 700,
                          backgroundColor: 'var(--mantine-color-coffee-7)',
                        }}
                      >
                        Add to Bag
                      </Button>
                    </Group>
                  </Group>
                </Box>
              </Card>
            )
          })}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
