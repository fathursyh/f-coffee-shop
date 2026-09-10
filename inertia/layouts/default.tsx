import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { AppShell } from '@mantine/core'
import AppHeader from '~/components/app_header'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, flash } = usePage<{ error?: string; success?: string }>()

  useEffect(() => {
    toast.dismiss()
  }, [url])

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
    <AppShell header={{ height: 64 }}>
      <AppHeader user={user} />
      <AppShell.Main bg="coffee.0">{children}</AppShell.Main>

      <Toaster position="bottom-right" richColors />
    </AppShell>
  )
}
