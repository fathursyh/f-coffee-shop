import { Container, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconFlame, IconLeaf, IconScale } from '@tabler/icons-react'

export default function RoasteryStandard() {
  return (
    <Container size="xl" py={{ base: 64, sm: 80, md: 96 }} px={{ base: 'md', sm: 'lg' }}>
      <Paper
        p={{ base: 'xl', sm: 36, md: 48 }}
        radius="lg"
        bg="white"
        style={{
          border: '1px solid var(--mantine-color-coffee-2)',
          boxShadow: 'none',
        }}
      >
        <Stack gap="xl">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <Text
              size="xs"
              fw={700}
              c="coffee.6"
              tt="uppercase"
              style={{ letterSpacing: '0.08em' }}
            >
              Craft & Transparency
            </Text>
            <Title
              order={2}
              c="coffee.9"
              mt={4}
              fz={{ base: '1.4rem', sm: '1.7rem', md: '1.8rem' }}
            >
              Why ordering beans from a micro-roastery matters
            </Title>
            <Text size="sm" c="coffee.7" mt={4} fz={{ base: 'xs', sm: 'sm' }}>
              Industrial supermarket coffee sits in cargo holds for months. Here is what we do
              differently for your morning brew.
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 'lg', md: 'xl' }}>
            <Stack gap="xs">
              <ThemeIcon size={42} radius="md" color="coffee" variant="light">
                <IconLeaf size={22} />
              </ThemeIcon>
              <Title order={4} c="coffee.9" style={{ fontSize: '1.1rem' }}>
                Direct-Trade Sourcing
              </Title>
              <Text size="xs" c="coffee.8" style={{ lineHeight: 1.6 }}>
                We work closely with family farms, washing stations, and organic cooperatives. We
                pay an average of 42% above Fair Trade minimums to ensure soil health and fair
                wages.
              </Text>
            </Stack>

            <Stack gap="xs">
              <ThemeIcon size={42} radius="md" color="coffee" variant="light">
                <IconFlame size={22} />
              </ThemeIcon>
              <Title order={4} c="coffee.9" style={{ fontSize: '1.1rem' }}>
                Drum-Roasted in Small Batches
              </Title>
              <Text size="xs" c="coffee.8" style={{ lineHeight: 1.6 }}>
                Every lot is test-cupped and roasted on a cast-iron Diedrich drum roaster. We tailor
                flame temperature and airflow to elevate the natural sweetness of each harvest.
              </Text>
            </Stack>

            <Stack gap="xs">
              <ThemeIcon size={42} radius="md" color="coffee" variant="light">
                <IconScale size={22} />
              </ThemeIcon>
              <Title order={4} c="coffee.9" style={{ fontSize: '1.1rem' }}>
                Aroma-Lock Resealable Pouches
              </Title>
              <Text size="xs" c="coffee.8" style={{ lineHeight: 1.6 }}>
                Our pouches are fitted with one-way degassing valves and zipper seals, allowing
                natural CO2 escape while blocking oxygen. Freshness guaranteed for 60+ days.
              </Text>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Paper>
    </Container>
  )
}
