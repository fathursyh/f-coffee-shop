import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconClock,
  IconFlame,
  IconPackage,
  IconTruckDelivery,
} from '@tabler/icons-react'

export default function HomeHero() {
  return (
    <Box
      py={{ base: 48, md: 72 }}
      style={{
        borderBottom: '1px solid var(--mantine-color-coffee-2)',
        background:
          'linear-gradient(180deg, rgba(253, 250, 247, 1) 0%, rgba(245, 237, 228, 0.45) 100%)',
      }}
    >
      <Container size="lg">
        <Stack align="center" gap="md" ta="center" maw={820} mx="auto">
          <Badge
            variant="outline"
            color="coffee"
            size="lg"
            radius="sm"
            leftSection={<IconFlame size={14} />}
            style={{
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderColor: 'var(--mantine-color-coffee-3)',
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Small-Batch Micro Roastery
          </Badge>

          <Title
            order={1}
            c="coffee.9"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            Honest coffee beans, roasted slow and shipped fresh.
          </Title>

          <Text size="lg" c="coffee.8" maw={640} style={{ lineHeight: 1.6 }}>
            Direct-trade single origins and seasonal roastery blends. We fire up our drum roaster
            every Tuesday and Thursday so your beans land on your doorstep right inside their peak
            flavor window.
          </Text>

          {/* Practical Roastery Highlights */}
          <Group gap="xs" mt="sm" justify="center" wrap="wrap">
            <Paper
              px="md"
              py={6}
              radius="xl"
              bg="white"
              style={{
                border: '1px solid var(--mantine-color-coffee-2)',
                boxShadow: 'none',
              }}
            >
              <Group gap={6}>
                <ThemeIcon size={20} radius="xl" color="coffee" variant="light">
                  <IconClock size={12} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="coffee.9">
                  Next Roast Day: Thursday 08:00 AM
                </Text>
              </Group>
            </Paper>

            <Paper
              px="md"
              py={6}
              radius="xl"
              bg="white"
              style={{
                border: '1px solid var(--mantine-color-coffee-2)',
                boxShadow: 'none',
              }}
            >
              <Group gap={6}>
                <ThemeIcon size={20} radius="xl" color="coffee" variant="light">
                  <IconTruckDelivery size={12} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="coffee.9">
                  Roasted & Dispatched &lt; 48 Hours
                </Text>
              </Group>
            </Paper>

            <Paper
              px="md"
              py={6}
              radius="xl"
              bg="white"
              style={{
                border: '1px solid var(--mantine-color-coffee-2)',
                boxShadow: 'none',
              }}
            >
              <Group gap={6}>
                <ThemeIcon size={20} radius="xl" color="coffee" variant="light">
                  <IconPackage size={12} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="coffee.9">
                  Valved Aromalock Kraft Bags
                </Text>
              </Group>
            </Paper>
          </Group>

          <Group gap="md" mt="md">
            <Button
              size="md"
              color="coffee"
              radius="md"
              rightSection={<IconArrowRight size={16} />}
              onClick={() => {
                document.getElementById('coffee-menu')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Current Roasts
            </Button>
            <Button
              size="md"
              variant="default"
              radius="md"
              color="coffee"
              onClick={() => {
                document.getElementById('brew-guide')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                borderColor: 'var(--mantine-color-coffee-3)',
                color: 'var(--mantine-color-coffee-8)',
                background: 'white',
              }}
            >
              Brew & Grind Guide
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}
