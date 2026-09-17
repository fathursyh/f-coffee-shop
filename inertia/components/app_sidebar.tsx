import {
  IconCoffee,
  IconDatabase,
  IconFlame,
  IconGauge,
  IconReportAnalytics,
  IconShoppingBag,
} from '@tabler/icons-react'
import { Badge, Box, Group, ScrollArea, Text, ThemeIcon } from '@mantine/core'
import { Link } from '@adonisjs/inertia/react'
import { LinksGroup, type LinksGroupProps } from './navbar_link_group'
import { UserButton } from './user_button'
import { type InertiaProps } from '~/types'
import classes from './app_sidebar.module.css'
import { usePage } from '@inertiajs/react'
import { useMemo } from 'react'

interface NavSection {
  title?: string
  items: LinksGroupProps[]
}

interface AppSidebarProps {
  user?: InertiaProps['user']
  onNavigate?: () => void
}

export function AppSidebar({ user, onNavigate }: AppSidebarProps) {
  const { pendingCoffees } = usePage().props

  const navSections: NavSection[] = useMemo(
    () => [
      {
        title: 'Operations',
        items: [
          {
            label: 'Overview',
            icon: IconGauge,
            link: 'admin.dashboard',
          },
          {
            label: 'Orders',
            icon: IconShoppingBag,
            initiallyOpened: true,
            badge: pendingCoffees.count > 0 ? pendingCoffees.count.toString() : undefined,
            link: undefined,
            links: [
              { label: 'All Orders', link: 'admin.orders' },
              { label: 'Pending Roast', link: 'admin.roast' },
            ],
          },
          {
            label: 'Bean Catalog',
            icon: IconFlame,
            link: undefined,
            initiallyOpened: true,
            links: [
              { label: 'Current Roasts', link: 'admin.coffees' },
              // { label: 'Brew & Grind Guide', link: '/#brew-guide' },
            ],
          },
        ],
      },
      {
        title: 'Data & Reports',
        items: [
          {
            label: 'Customer Data',
            icon: IconDatabase,
            link: 'admin.customers',
          },
          {
            label: 'Reports',
            icon: IconReportAnalytics,
            link: 'admin.reports',
          },
        ],
      },
    ],
    [pendingCoffees.count]
  )
  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between" wrap="nowrap">
          <Link href="/admin/dashboard" className={classes.brandLink}>
            <ThemeIcon size={34} radius="md" color="coffee" variant="filled">
              <IconCoffee size={20} stroke={1.8} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="sm" c="coffee.9" style={{ lineHeight: 1.2 }}>
                F-Coffee Shop
              </Text>
              <Text
                size="10px"
                c="coffee.6"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                Micro Roastery
              </Text>
            </div>
          </Link>
          <Badge variant="light" color="coffee" size="xs" radius="sm">
            Admin
          </Badge>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {navSections.map((section, idx) => (
            <Box key={section.title || idx} mb="sm">
              {section.title && <div className={classes.sectionTitle}>{section.title}</div>}
              {section.items.map((item) => (
                <LinksGroup {...item} key={item.label} onNavigate={onNavigate} />
              ))}
            </Box>
          ))}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton user={user} />
      </div>
    </nav>
  )
}
