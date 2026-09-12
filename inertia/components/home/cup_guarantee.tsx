import { Container, Paper, Text, ThemeIcon, Title } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import classes from './cup_guarantee.module.css'

export default function CupGuarantee() {
  return (
    <Container size="md" py={{ base: 64, sm: 80, md: 96 }} px={{ base: 'md', sm: 'lg' }}>
      <Paper p={{ base: 'xl', sm: 36, md: 40 }} radius="lg" bg="coffee.1" className={classes.paper}>
        <ThemeIcon size={36} radius="xl" color="coffee" variant="filled" mx="auto" mb="xs">
          <IconHeart size={18} />
        </ThemeIcon>
        <Title order={3} c="coffee.9" className={classes.title}>
          The Cup Happiness Guarantee
        </Title>
        <Text size="sm" c="coffee.8" mt={6} maw={560} mx="auto" style={{ lineHeight: 1.6 }}>
          If a coffee doesn&apos;t brew the way you hoped with your home setup, send us a quick
          note. We&apos;ll happily send you another roast profile or grind setting on the house.
          Good mornings start with good coffee.
        </Text>
        <Text size="xs" c="coffee.6" fw={600} mt="md">
          — Hand-packed by our roastery crew in small batches
        </Text>
      </Paper>
    </Container>
  )
}
