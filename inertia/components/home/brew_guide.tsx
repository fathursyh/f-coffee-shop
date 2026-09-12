import { Box, Container, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import classes from './brew_guide.module.css'

export default function BrewGuide() {
  const brewGuides = [
    {
      title: 'Pour Over / V60',
      grindSize: 'Medium-Fine (like kosher salt)',
      description:
        'Ratio 1:16 (15g coffee to 240g water at 92°C-94°C). Yields clean floral aromatics and sparkling clarity.',
    },
    {
      title: 'AeroPress & Drip',
      grindSize: 'Medium (like table sand)',
      description:
        'Ratio 1:15 (16g coffee to 240g water). Balanced extraction, round body, ideal for your morning batch brewer.',
    },
    {
      title: 'Espresso & Moka Pot',
      grindSize: 'Fine (powdery with slight grit)',
      description:
        'Ratio 1:2 (18g dry dose yielding 36g liquid in 27-30s). Dense crema, chocolate sweetness, and thick body.',
    },
    {
      title: 'French Press & Cold Brew',
      grindSize: 'Coarse (like cracked sea salt)',
      description:
        'Ratio 1:14 (30g coffee to 420g water, 4 min plunge) or 1:8 for 16-hour steeped cold brew concentrate.',
    },
  ]

  return (
    <Container
      size="xl"
      py={{ base: 64, sm: 80, md: 96 }}
      px={{ base: 'md', sm: 'lg' }}
      id="brew-guide"
    >
      <Stack gap="xl">
        <Box>
          <Text size="xs" fw={700} c="coffee.6" tt="uppercase" className={classes.eyebrow}>
            Home Barista Companion
          </Text>
          <Title order={2} c="coffee.9" fz={{ base: '1.4rem', sm: '1.7rem', md: '1.8rem' }}>
            Grind Size &amp; Brewing Ratio Guide
          </Title>
          <Text size="sm" c="coffee.7" fz={{ base: 'xs', sm: 'sm' }} mt={4}>
            Not sure which grind to select for your kitchen setup? Here is our roaster&apos;s cheat
            sheet.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 'md', sm: 'lg' }}>
          {brewGuides.map((guide) => (
            <Paper
              key={guide.title}
              p={{ base: 'lg', sm: 'md' }}
              radius="md"
              bg="white"
              className={classes.card}
            >
              <Text size="xs" fw={700} c="coffee.9">
                {guide.title}
              </Text>
              <Text size="11px" c="coffee.6" fw={600} mb={6}>
                {guide.grindSize}
              </Text>
              <Text size="xs" c="coffee.8" style={{ lineHeight: 1.5 }}>
                {guide.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
