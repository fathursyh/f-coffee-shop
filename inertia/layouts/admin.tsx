import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { type ReactElement, useEffect } from 'react'
import { AppShell, Badge, Burger, Button, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCoffee, IconExternalLink } from '@tabler/icons-react'
import { AppSidebar } from '~/components/app_sidebar'
import classes from './admin.module.css'
import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'

export default function AdminLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, flash } = usePage<{ error?: string; success?: string }>()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure()

  useEffect(() => {
    toast.dismiss()
    closeMobile()
  }, [closeMobile, url])

  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error)
    }
    if (flash?.success) {
      toast.success(flash.success)
    }
  }, [flash])

  const user = children.props.user

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding={0}
    >
      <AppShell.Header className={classes.header}>
        <Group justify="space-between" h="100%" px="md">
          <Group gap="sm">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="sm"
              color="var(--mantine-color-coffee-8)"
              aria-label="Toggle navigation"
            />
            <Group gap="xs">
              <Badge
                variant="light"
                color="coffee"
                size="md"
                radius="sm"
                leftSection={<IconCoffee size={14} />}
                style={{ fontWeight: 600 }}
              >
                Roastery Operations
              </Badge>
            </Group>
          </Group>

          <Group gap="xs">
            <Button
              component={Link}
              href="/"
              variant="subtle"
              color="coffee"
              size="xs"
              leftSection={<IconExternalLink size={14} />}
              radius="md"
            >
              View Storefront
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar}>
        <AppSidebar user={user} onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main bg="coffee.0" className={classes.main}>
        <div className={classes.contentWrapper}>{children}</div>
      </AppShell.Main>

      <Toaster position="top-center" richColors />
    </AppShell>
  )
}
