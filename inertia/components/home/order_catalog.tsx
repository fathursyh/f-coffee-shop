import {
  ActionIcon,
  Badge,
  Box,
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

interface OrderCatalogProps {
  onAddToCart: (bean: CoffeeBean, selection: BeanSelection) => void
}

export default function OrderCatalog({ onAddToCart }: OrderCatalogProps) {
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

  const handleAddToCartClick = (bean: CoffeeBean) => {
    const selection = beanSelections[bean.id] || {
      weight: '250g',
      grind: 'whole-bean',
      quantity: 1,
    }
    onAddToCart(bean, selection)
  }

  const filteredBeans = useMemo(() => {
    if (selectedRoastFilter === 'all') return COFFEE_BEANS
    if (selectedRoastFilter === 'light')
      return COFFEE_BEANS.filter((b) => b.roast === 'Light' || b.roast === 'Medium-Light')
    if (selectedRoastFilter === 'medium') return COFFEE_BEANS.filter((b) => b.roast === 'Medium')
    if (selectedRoastFilter === 'dark')
      return COFFEE_BEANS.filter((b) => b.roast === 'Medium-Dark' || b.roast === 'Dark')
    if (selectedRoastFilter === 'single-origin')
      return COFFEE_BEANS.filter((b) => !b.name.includes('Blend'))
    return COFFEE_BEANS
  }, [selectedRoastFilter])

  return (
    <Container size="xl" pt={48} id="coffee-menu">
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
            <Title order={2} c="coffee.9" style={{ fontSize: '1.9rem' }}>
              Order Fresh Whole Bean or Custom Grind
            </Title>
            <Text size="sm" c="coffee.7" mt={4}>
              Select your preferred pouch weight and brewing method. We grind fresh on an EK43 right
              before packing.
            </Text>
          </Box>

          {/* Filter Pills */}
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
              },
              indicator: {
                backgroundColor: 'var(--mantine-color-coffee-7)',
              },
            }}
          />
        </Flex>

        {/* Coffee Cards Grid */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {filteredBeans.map((bean) => {
            const selection = beanSelections[bean.id] || {
              weight: '250g',
              grind: 'whole-bean',
              quantity: 1,
            }
            const currentPrice = getBeanPrice(bean.basePrice250g, selection.weight)

            return (
              <Card
                key={bean.id}
                padding="lg"
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
                    <Title order={3} c="coffee.9" style={{ fontSize: '1.35rem', lineHeight: 1.25 }}>
                      {bean.name}
                    </Title>
                    <Text size="xs" fw={600} c="coffee.6" mt={2}>
                      {bean.subregion} · {bean.origin}
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
                    <Group gap="xs" justify="space-between">
                      <Box>
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Elevation
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8">
                          {bean.elevation}
                        </Text>
                      </Box>
                      <Divider orientation="vertical" />
                      <Box>
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Process
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8" truncate maw={130}>
                          {bean.process}
                        </Text>
                      </Box>
                      <Divider orientation="vertical" />
                      <Box>
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Best Brew
                        </Text>
                        <Text size="xs" fw={600} c="coffee.8" truncate maw={90}>
                          {bean.bestFor.split(',')[0]}
                        </Text>
                      </Box>
                    </Group>
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
                      {bean.tastingNotes.map((note) => (
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
                          { label: '250g Standard', value: '250g' },
                          { label: '500g Value', value: '500g' },
                          { label: '1kg Bulk', value: '1kg' },
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
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text size="xs" c="dimmed">
                        Subtotal
                      </Text>
                      <Text fw={700} size="lg" c="coffee.9">
                        ${(currentPrice * selection.quantity).toFixed(2)}
                      </Text>
                    </Box>

                    <Group gap={6}>
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
                          size="xs"
                          variant="subtle"
                          color="coffee"
                          onClick={() => handleQuantityChange(bean.id, -1)}
                          disabled={selection.quantity <= 1}
                        >
                          <IconMinus size={12} />
                        </ActionIcon>
                        <Text size="xs" fw={600} c="coffee.9" px={4}>
                          {selection.quantity}
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="coffee"
                          onClick={() => handleQuantityChange(bean.id, 1)}
                        >
                          <IconPlus size={12} />
                        </ActionIcon>
                      </Group>

                      <Box
                        px={12}
                        py={6}
                        style={{
                          backgroundColor: 'var(--mantine-color-coffee-7)',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={() => handleAddToCartClick(bean)}
                      >
                        <Text size="xs" fw={700} c="white">
                          Add
                        </Text>
                      </Box>
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

export type RoastType = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark'

export interface CoffeeBean {
  id: string
  name: string
  origin: string
  subregion: string
  elevation: string
  process: string
  roast: RoastType
  roastLevel: number
  tastingNotes: string[]
  description: string
  bestFor: string
  basePrice250g: number
  badge?: string
}

export interface CartItem {
  id: string
  coffeeId: string
  name: string
  origin: string
  roast: RoastType
  weight: '250g' | '500g' | '1kg'
  grind: string
  price: number
  quantity: number
}

export interface BeanSelection {
  weight: '250g' | '500g' | '1kg'
  grind: string
  quantity: number
}

export const COFFEE_BEANS: CoffeeBean[] = [
  {
    id: 'guji-highland-flora',
    name: 'Guji Highland Flora',
    origin: 'Ethiopia',
    subregion: 'Uraga, Guji Zone',
    elevation: '2,150 MASL',
    process: 'Natural / Slow Sun-Dried',
    roast: 'Light',
    roastLevel: 1.5,
    tastingNotes: ['Bergamot', 'Wild Peach', 'Jasmine Blossom', 'Orange Blossom Honey'],
    description:
      'Silky, tea-like clarity with floral sweetness and lingering nectarine juiciness. Handpicked heirloom varietals grown by smallholders in dense shade.',
    bestFor: 'V60, Chemex, Aeropress',
    basePrice250g: 19.5,
    badge: "Roaster's Pick",
  },
  {
    id: 'finca-la-esperanza',
    name: 'Finca La Esperanza',
    origin: 'Colombia',
    subregion: 'San Adolfo, Huila',
    elevation: '1,780 MASL',
    process: 'Honey Process / Caturra',
    roast: 'Medium-Light',
    roastLevel: 2.5,
    tastingNotes: ['Milk Chocolate', 'Red Gala Apple', 'Toasted Almond', 'Cane Sugar'],
    description:
      'The quintessential comfort cup with a bright, crisp apple acidity balanced by warm panela sugar and milk chocolate body.',
    bestFor: 'Pour Over, Drip, Flat White',
    basePrice250g: 18.0,
    badge: 'Seasonal Lot',
  },
  {
    id: 'antigua-los-volcanes',
    name: 'Antigua Los Volcanes',
    origin: 'Guatemala',
    subregion: 'Sacatepéquez Valley',
    elevation: '1,650 MASL',
    process: 'Fully Washed / Bourbon',
    roast: 'Medium',
    roastLevel: 3,
    tastingNotes: ['Spiced Caramel', 'Candied Orange', 'Dark Cocoa', 'Pecan'],
    description:
      'Grown in rich volcanic mineral soil beneath Agua and Fuego volcanoes. Round mouthfeel, sweet citrus aromatics, and a warm caramel finish.',
    bestFor: 'French Press, Moka Pot, Drip',
    basePrice250g: 17.5,
    badge: 'Everyday Classic',
  },
  {
    id: 'sumatra-gayo-mountain',
    name: 'Sumatra Gayo Highlands',
    origin: 'Indonesia',
    subregion: 'Takengon, Aceh',
    elevation: '1,500 MASL',
    process: 'Traditional Wet-Hulled (Giling Basah)',
    roast: 'Medium-Dark',
    roastLevel: 4,
    tastingNotes: ['Dark Forest Honey', 'Cedarwood', 'Baking Spice', 'Cacao Nibs'],
    description:
      'Deep, syrupy, and exceptionally low in perceived acidity. Cultivated by organic smallholders under native shade trees in northern Sumatra.',
    bestFor: 'French Press, Cold Brew, Espresso',
    basePrice250g: 18.5,
  },
  {
    id: 'hearthstone-house-blend',
    name: 'Hearthstone Espresso Blend',
    origin: 'Brazil & Ethiopia Blend',
    subregion: 'Cerrado Mineiro & Sidama',
    elevation: '1,100 - 1,900 MASL',
    process: 'Pulped Natural & Washed',
    roast: 'Dark',
    roastLevel: 4.5,
    tastingNotes: ['Fudge Truffle', 'Dark Molasses', 'Roasted Hazelnut', 'Warm Crema'],
    description:
      'Our house cornerstone blend. Formulated to slice through steamed milk with velvety cocoa density, or yield thick, viscous straight shots.',
    bestFor: 'Espresso Machine, Moka Pot, Cold Brew',
    basePrice250g: 16.5,
    badge: 'Flagship Blend',
  },
  {
    id: 'cauca-sugarcane-decaf',
    name: 'Cauca Valley Nightcap Decaf',
    origin: 'Colombia',
    subregion: 'Inzá, Cauca',
    elevation: '1,700 MASL',
    process: 'EA Sugarcane Natural Decaf',
    roast: 'Medium',
    roastLevel: 3,
    tastingNotes: ['Brown Sugar', 'Graham Cracker', 'Red Cherry', 'Malted Toffee'],
    description:
      'Naturally decaffeinated using fermented molasses from local Colombian sugarcane. Retains 100% of the origin terroir with none of the late-night jitters.',
    bestFor: 'Any Brewing Method',
    basePrice250g: 18.0,
    badge: 'Caffeine-Free',
  },
]
