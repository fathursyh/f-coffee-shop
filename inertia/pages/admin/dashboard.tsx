import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { Link } from '@adonisjs/inertia/react'
import {
  IconArrowRight,
  IconCalendarEvent,
  IconClock,
  IconCoffee,
  IconFlame,
  IconPackage,
  IconShoppingBag,
  IconSparkles,
  IconTrendingUp,
  IconTruckDelivery,
} from '@tabler/icons-react'
import classes from './dashboard.module.css'

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Orders',
      value: '18 Pouches',
      diff: '+12% vs last batch',
      icon: IconShoppingBag,
      color: 'coffee.7',
    },
    {
      title: 'Next Roast Batch',
      value: 'Thu 08:00 AM',
      diff: 'Diedrich Drum #1',
      icon: IconClock,
      color: 'coffee.8',
    },
    {
      title: 'Bean Varieties',
      value: '6 Single Origins',
      diff: '100% Direct Trade',
      icon: IconCoffee,
      color: 'coffee.6',
    },
    {
      title: 'Packaging & Dispatch',
      value: '< 48h Window',
      diff: 'Valved Kraft Bags',
      icon: IconTruckDelivery,
      color: 'coffee.9',
    },
  ]

  const upcomingBatches = [
    {
      bean: 'Ethiopia Guji Highland Flora',
      roast: 'Light Roast',
      pouchSize: '250g / 500g',
      quantity: '8 Bags',
      status: 'QUEUED',
      statusColor: 'yellow',
    },
    {
      bean: 'Colombia Finca La Esperanza',
      roast: 'Medium-Light',
      pouchSize: '500g',
      quantity: '5 Bags',
      status: 'PREPPED',
      statusColor: 'blue',
    },
    {
      bean: 'Guatemala Antigua Los Volcanes',
      roast: 'Medium Roast',
      pouchSize: '1kg',
      quantity: '3 Bags',
      status: 'ROASTING',
      statusColor: 'coffee',
    },
    {
      bean: 'Sumatra Gayo Mountain Organic',
      roast: 'Dark Roast',
      pouchSize: '250g',
      quantity: '4 Bags',
      status: 'PACKED',
      statusColor: 'green',
    },
  ]

  return (
    <Stack gap="lg">
      {/* Top Banner */}
      <Paper className={classes.bannerCard}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box maw={620}>
            <Group gap="xs" mb={6}>
              <ThemeIcon size={24} radius="xl" color="coffee" variant="light">
                <IconSparkles size={14} />
              </ThemeIcon>
              <Text
                size="xs"
                fw={700}
                c="coffee.7"
                tt="uppercase"
                style={{ letterSpacing: '0.08em' }}
              >
                Micro Roastery Control Center
              </Text>
            </Group>
            <Title
              order={1}
              c="coffee.9"
              style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25 }}
            >
              Roastery Operations Dashboard
            </Title>
            <Text size="sm" c="coffee.8" mt={6} style={{ lineHeight: 1.55 }}>
              Monitor incoming bean orders, manage roast batch schedules, and ensure all customer
              pouches are packed inside their peak flavor window.
            </Text>
          </Box>

          <Group gap="sm">
            <Badge
              size="lg"
              color="coffee"
              variant="filled"
              leftSection={<IconCalendarEvent size={14} />}
              style={{ fontWeight: 600, backgroundColor: 'var(--mantine-color-coffee-8)' }}
            >
              Roast Day: Thursday
            </Badge>
            <Button
              component={Link}
              href="/orders"
              color="coffee"
              size="sm"
              radius="md"
              leftSection={<IconPackage size={16} />}
            >
              View Order Queue
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Paper key={stat.title} className={classes.statCard}>
              <Group justify="space-between" align="flex-start" mb="xs">
                <Text
                  size="xs"
                  c="coffee.6"
                  fw={700}
                  tt="uppercase"
                  style={{ letterSpacing: '0.06em' }}
                >
                  {stat.title}
                </Text>
                <ThemeIcon size={36} radius="md" color="coffee" variant="light">
                  <Icon size={18} stroke={1.8} />
                </ThemeIcon>
              </Group>

              <Text size="1.5rem" fw={800} c="coffee.9">
                {stat.value}
              </Text>

              <Group gap={4} mt={6}>
                <IconTrendingUp size={14} color="var(--mantine-color-coffee-6)" />
                <Text size="xs" c="coffee.6" fw={600}>
                  {stat.diff}
                </Text>
              </Group>
            </Paper>
          )
        })}
      </SimpleGrid>

      {/* Main Grid: Batches & Quick Actions */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {/* Left Column (2 spans): Roast Queue */}
        <Box style={{ gridColumn: 'span 2' }}>
          <Paper className={classes.sectionCard}>
            <Group justify="space-between" mb="md">
              <Box>
                <Title order={2} c="coffee.9" style={{ fontSize: '1.2rem' }}>
                  Current Roastery Queue
                </Title>
                <Text size="xs" c="coffee.6">
                  Live orders scheduled for batch roast on Diedrich drum roaster
                </Text>
              </Box>

              <Button
                component={Link}
                href="/orders"
                variant="subtle"
                color="coffee"
                size="xs"
                rightSection={<IconArrowRight size={14} />}
              >
                All Orders
              </Button>
            </Group>

            <Divider color="coffee.1" mb="sm" />

            <Stack gap={0}>
              {upcomingBatches.map((batch) => (
                <div key={batch.bean} className={classes.orderRow}>
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={700} c="coffee.9" truncate>
                        {batch.bean}
                      </Text>
                      <Text size="xs" c="coffee.6">
                        {batch.roast} · {batch.pouchSize}
                      </Text>
                    </Box>

                    <Group gap="sm" wrap="nowrap">
                      <Text size="xs" fw={700} c="coffee.8">
                        {batch.quantity}
                      </Text>
                      <Badge size="xs" variant="light" color={batch.statusColor} radius="sm">
                        {batch.status}
                      </Badge>
                    </Group>
                  </Group>
                </div>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Right Column (1 span): Roastery Freshness Standard */}
        <Box>
          <Paper className={classes.sectionCard}>
            <Title order={3} c="coffee.9" style={{ fontSize: '1.1rem' }} mb="xs">
              Roastery Standards
            </Title>
            <Text size="xs" c="coffee.7" mb="md" style={{ lineHeight: 1.5 }}>
              Peak flavor extraction requires fresh shipping within 48 hours of drum roasting.
            </Text>

            <Stack gap="sm">
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="coffee.9">
                    Peak Freshness Goal
                  </Text>
                  <Text size="xs" fw={700} c="coffee.8">
                    94%
                  </Text>
                </Group>
                <Progress
                  value={94}
                  color="coffee"
                  size="sm"
                  radius="xl"
                  styles={{ section: { backgroundColor: 'var(--mantine-color-coffee-7)' } }}
                />
              </Box>

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="coffee.9">
                    Direct Trade Compliance
                  </Text>
                  <Text size="xs" fw={700} c="coffee.8">
                    100%
                  </Text>
                </Group>
                <Progress
                  value={100}
                  color="coffee"
                  size="sm"
                  radius="xl"
                  styles={{ section: { backgroundColor: 'var(--mantine-color-coffee-8)' } }}
                />
              </Box>

              <Divider color="coffee.1" my="xs" />

              <Title
                order={4}
                size="xs"
                c="coffee.9"
                tt="uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                Quick Navigation
              </Title>

              <Button
                component={Link}
                href="/#coffee-menu"
                variant="outline"
                color="coffee"
                size="xs"
                fullWidth
                leftSection={<IconCoffee size={14} />}
                justify="flex-start"
              >
                Customer Coffee Menu
              </Button>

              <Button
                component={Link}
                href="/#brew-guide"
                variant="outline"
                color="coffee"
                size="xs"
                fullWidth
                leftSection={<IconFlame size={14} />}
                justify="flex-start"
              >
                Brew & Grind Guide
              </Button>

              <Button
                component={Link}
                href="/user_info/create"
                variant="outline"
                color="coffee"
                size="xs"
                fullWidth
                leftSection={<IconTruckDelivery size={14} />}
                justify="flex-start"
              >
                Add Customer Address
              </Button>
            </Stack>
          </Paper>
        </Box>
      </SimpleGrid>
    </Stack>
  )
}
