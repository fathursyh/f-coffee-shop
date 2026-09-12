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
import classes from './hero.module.css'

export default function HomeHero() {
  return (
    <Box
      py={{ base: 36, sm: 52, md: 72 }}
      px={{ base: 'xs', sm: 'md' }}
      className={classes.heroBox}
    >
      <Container size="lg" px={{ base: 'xs', sm: 'md' }}>
        <Stack align="center" py={{ base: 'sm' }} ta="center" maw={820} mx="auto">
          <Badge
            variant="outline"
            color="coffee"
            size="lg"
            radius="sm"
            leftSection={<IconFlame size={14} />}
            classNames={{ root: classes.badge }}
          >
            Small-Batch Micro Roastery
          </Badge>

          <Title order={1} c="coffee.9" className={classes.heroTitle}>
            Honest coffee beans, roasted slow and shipped fresh.
          </Title>

          <Text
            size="md"
            c="coffee.8"
            maw={640}
            fz={{ base: 'sm', sm: 'md', md: 'lg' }}
            className={classes.bodyText}
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
              className={classes.highlightPill}
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
              className={classes.highlightPill}
            >
              <Group gap={6}>
                <ThemeIcon size={20} radius="xl" color="coffee" variant="light">
                  <IconTruckDelivery size={12} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="coffee.9">
                  Roasted &amp; Dispatched &lt; 48 Hours
                </Text>
              </Group>
            </Paper>

            <Paper
              px={{ base: 'xs', sm: 'md' }}
              py={6}
              radius="xl"
              bg="white"
              className={classes.highlightPill}
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
              classNames={{ root: classes.outlineBtn }}
            >
              Brew &amp; Grind Guide
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}
