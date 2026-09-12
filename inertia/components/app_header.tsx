import { Form, Link } from '@adonisjs/inertia/react'
import { IconCoffee, IconLogin2, IconLogout } from '@tabler/icons-react'
import { AppShell, Avatar, Box, Button, Container, Group, Menu, Title } from '@mantine/core'
import { type InertiaProps } from '~/types'
import classes from './app_header.module.css'

type AppHeaderProps = {
  user: InertiaProps['user']
}

export default function AppHeader({ user }: AppHeaderProps) {
  return (
    <AppShell.Header bg="white" className={classes.header}>
      <Container size="xl" h="100%">
        <Group justify="space-between" h="100%" w="100%">
          {/* Brand / Logo */}
          <Box component={Link} route="home" c="coffee.8" className={classes.brand}>
            <IconCoffee />
            <Title size="lg" fw="bold" component="span">
              F-Coffee Shop
            </Title>
          </Box>

          {/* Navigation Controls */}
          <Group gap="sm">
            {user ? (
              <Menu width={160} position="bottom-start">
                <Menu.Target>
                  <Avatar
                    radius="xl"
                    size="md"
                    variant="filled"
                    color="coffee.7"
                    style={{ fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    {user.initials}
                  </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item component={Link} route="home" leftSection={<IconCoffee size={14} />}>
                    My Orders
                  </Menu.Item>
                  <Form route="session.destroy">
                    <Menu.Item
                      color="red"
                      type="submit"
                      leftSection={<IconLogout size={14} />}
                      onClick={(e) => {
                        if (!window.confirm('Logout from this session?')) e.preventDefault()
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Form>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                component={Link}
                route="session.create"
                size="sm"
                leftSection={<IconLogin2 />}
              >
                Login
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  )
}
