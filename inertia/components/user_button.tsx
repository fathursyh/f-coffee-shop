import { Form, Link } from '@adonisjs/inertia/react'
import { IconChevronRight, IconCoffee, IconLogout, IconShoppingBag } from '@tabler/icons-react'
import { Avatar, Badge, Box, Divider, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { type InertiaProps } from '~/types'
import classes from './user_button.module.css'

interface UserButtonProps {
  user?: InertiaProps['user']
}

export function UserButton({ user }: UserButtonProps) {
  const displayName = user?.fullName || 'Roastery Admin'
  const displayEmail = user?.email || 'admin@f-coffee.local'
  const initials = user?.initials || displayName.slice(0, 2).toUpperCase()

  return (
    <Menu
      position="top-end"
      withArrow
      shadow="md"
      width={220}
      classNames={{ dropdown: classes.menuDropdown }}
    >
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" style={{ overflow: 'hidden' }}>
              <Avatar
                radius="xl"
                size="sm"
                color="coffee.7"
                variant="filled"
                style={{ fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}
              >
                {initials}
              </Avatar>

              <Box style={{ minWidth: 0 }}>
                <Text size="xs" fw={700} c="coffee.9" truncate>
                  {displayName}
                </Text>
                <Text c="coffee.6" size="10px" truncate>
                  {displayEmail}
                </Text>
              </Box>
            </Group>

            <IconChevronRight
              size={14}
              stroke={1.5}
              color="var(--mantine-color-coffee-6)"
              style={{ flexShrink: 0 }}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <div className={classes.userHeader}>
          <Text size="xs" fw={700} c="coffee.9" truncate>
            {displayName}
          </Text>
          <Text size="10px" c="dimmed" truncate mb={4}>
            {displayEmail}
          </Text>
          <Badge size="xs" variant="light" color="coffee">
            {user?.role || 'Admin'}
          </Badge>
        </div>

        <Menu.Item component={Link} route="home" leftSection={<IconCoffee size={14} />}>
          Storefront
        </Menu.Item>

        <Menu.Item
          component={Link}
          route="orders.index"
          leftSection={<IconShoppingBag size={14} />}
        >
          Customer Orders
        </Menu.Item>

        <Divider my={4} color="coffee.1" />

        <Form route="session.destroy">
          <Menu.Item
            color="red"
            type="submit"
            leftSection={<IconLogout size={14} />}
            onClick={(e) => {
              if (!window.confirm('Sign out of Roastery Admin?')) {
                e.preventDefault()
              }
            }}
          >
            Sign Out
          </Menu.Item>
        </Form>
      </Menu.Dropdown>
    </Menu>
  )
}
