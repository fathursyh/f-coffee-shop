import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
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
      py={{ base: 60, sm: 76, md: 92 }}
      px={{ base: 'md', sm: 'lg' }}
      style={{
        borderBottom: '1px solid var(--mantine-color-coffee-2)',
        background:
          'linear-gradient(180deg, rgba(253, 250, 247, 1) 0%, rgba(245, 237, 228, 0.45) 100%)',
      }}
    >
      <Container size="lg" px={{ base: 'md', sm: 'lg' }}>
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
              fontSize: 'clamp(1.75rem, 6vw, 3.4rem)',
              lineHeight: 1.18,
              fontWeight: 700,
              wordBreak: 'break-word',
            }}
          >
            Honest coffee beans, roasted slow and shipped fresh.
          </Title>

          <Text
            size="md"
            c="coffee.8"
            maw={640}
            style={{ lineHeight: 1.6 }}
            fz={{ base: 'sm', sm: 'md', md: 'lg' }}
          >
            Direct-trade single origins and seasonal roastery blends. We fire up our drum roaster
            every Tuesday and Thursday so your beans land on your doorstep right inside their peak
            flavor window.
          </Text>

          {/* Practical Roastery Highlights */}
          <Group gap={6} mt="xs" justify="center" wrap="wrap">
            <Paper
              px={{ base: 'xs', sm: 'md' }}
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
              px={{ base: 'xs', sm: 'md' }}
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
              px={{ base: 'xs', sm: 'md' }}
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

          <Flex
            direction={{ base: 'column', sm: 'row' }}
            gap="sm"
            mt="md"
            w={{ base: '100%', sm: 'auto' }}
            justify="center"
          >
            <Button
              size="md"
              color="coffee"
              radius="md"
              w={{ base: '100%', sm: 'auto' }}
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
              w={{ base: '100%', sm: 'auto' }}
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
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}
