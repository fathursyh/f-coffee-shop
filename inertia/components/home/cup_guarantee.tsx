import { Box, Container, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'

export default function CupGuarantee() {
  return (
    <Container size="md" pt={64}>
      <Paper
        p="xl"
        radius="lg"
        bg="coffee.1"
        style={{
          border: '1px dashed var(--mantine-color-coffee-3)',
          boxShadow: 'none',
          textAlign: 'center',
        }}
      >
        <ThemeIcon size={36} radius="xl" color="coffee" variant="filled" mx="auto" mb="xs">
          <IconHeart size={18} />
        </ThemeIcon>
        <Title order={3} c="coffee.9" style={{ fontSize: '1.25rem' }}>
          The Cup Happiness Guarantee
        </Title>
        <Text size="sm" c="coffee.8" mt={6} maw={560} mx="auto" style={{ lineHeight: 1.6 }}>
          If a coffee doesn't brew the way you hoped with your home setup, send us a quick note.
          We'll happily send you another roast profile or grind setting on the house. Good mornings
          start with good coffee.
        </Text>
        <Text size="xs" c="coffee.6" fw={600} mt="md">
          — Hand-packed by our roastery crew in small batches
        </Text>
      </Paper>
    </Container>
  )
}
