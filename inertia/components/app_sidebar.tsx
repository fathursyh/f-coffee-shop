import {
  IconAdjustments,
  IconCoffee,
  IconFlame,
  IconGauge,
  IconShoppingBag,
  IconTruckDelivery,
} from '@tabler/icons-react'
import { Badge, Box, Group, ScrollArea, Text, ThemeIcon } from '@mantine/core'
import { Link } from '@adonisjs/inertia/react'
import { LinksGroup, type LinksGroupProps } from './navbar_link_group'
import { UserButton } from './user_button'
import { type InertiaProps } from '~/types'
import classes from './app_sidebar.module.css'

interface NavSection {
  title?: string
  items: LinksGroupProps[]
}

const navSections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      {
        label: 'Dashboard',
        icon: IconGauge,
        link: '/admin/dashboard',
      },
      {
        label: 'Orders',
        icon: IconShoppingBag,
        initiallyOpened: true,
        badge: 'Live',
        links: [
          { label: 'All Orders', link: '/orders' },
          { label: 'Pending Roast', link: '/orders' },
        ],
      },
      {
        label: 'Bean Catalog',
        icon: IconFlame,
        links: [
          { label: 'Current Roasts', link: '/#coffee-menu' },
          { label: 'Brew & Grind Guide', link: '/#brew-guide' },
        ],
      },
    ],
  },
  {
    title: 'Store & Fulfillment',
    items: [
      {
        label: 'Customer Addresses',
        icon: IconTruckDelivery,
        link: '/user_info/create',
      },
      {
        label: 'Public Storefront',
        icon: IconCoffee,
        link: '/',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Roastery Settings',
        icon: IconAdjustments,
        link: '/admin/dashboard',
      },
    ],
  },
]

interface AppSidebarProps {
  user?: InertiaProps['user']
  onNavigate?: () => void
}

export function AppSidebar({ user, onNavigate }: AppSidebarProps) {
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
