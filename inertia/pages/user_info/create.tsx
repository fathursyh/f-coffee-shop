import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Anchor,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconArrowLeft,
  IconBuildingCommunity,
  IconDeviceLandlinePhone,
  IconMailbox,
  IconMapPin,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react'
import classes from './user_info.module.css'

type UserInfoData = {
  id: number
  address: string
  city: string
  country: string
  postCode?: string
  post_code?: string
  phone: string
}

type CreateAddressProps = {
  userInfo?: UserInfoData | null
}

export default function CreateAddress({ userInfo }: CreateAddressProps) {
  const isEditing = Boolean(userInfo && userInfo.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm({
    initialValues: {
      address: userInfo?.address || '',
      city: userInfo?.city || '',
      post_code: userInfo?.postCode || userInfo?.post_code || '',
      country: userInfo?.country || '',
      phone: userInfo?.phone || '',
    },
    validate: {
      address: (val) => (val.trim().length >= 3 ? null : 'Street address must be at least 3 characters'),
      city: (val) => (val.trim().length >= 2 ? null : 'City must be at least 2 characters'),
      post_code: (val) => (val.trim().length >= 2 ? null : 'Postal code is required (max 6 characters)'),
      country: (val) => (val.trim().length >= 2 ? null : 'Country is required'),
      phone: (val) => (val.trim().length >= 6 ? null : 'Valid phone number is required'),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    setIsSubmitting(true)
    if (isEditing && userInfo) {
      router.put(`/user_info/${userInfo.id}`, values, {
        onFinish: () => setIsSubmitting(false),
      })
    } else {
      router.post('/user_info', values, {
        onFinish: () => setIsSubmitting(false),
      })
    }
  }

  const handleDelete = () => {
    if (!userInfo) return
    if (!window.confirm('Are you sure you want to remove your saved shipping address?')) return
    setIsDeleting(true)
    router.delete(`/user_info/${userInfo.id}`, {
      onFinish: () => setIsDeleting(false),
    })
  }

  return (
    <Box bg="coffee.0" py="xl" className={classes.pageWrapper} style={{ minHeight: '100dvh' }}>
      <Container size={560} w="100%">
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={56} radius="xl" variant="light" color="coffee">
            <IconMapPin size={30} stroke={1.75} />
          </ThemeIcon>

          <Title order={1} c="coffee.9">
            {isEditing ? 'Update Shipping Address' : 'Add Shipping Address'}
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            {isEditing
              ? 'Update the primary address where we deliver your freshly roasted coffee batches.'
              : 'Where should we deliver your freshly roasted coffee?'}
          </Text>
        </Stack>

        <Paper p={36} radius="md" withBorder shadow="sm" bg="white">
          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack gap="md">
              <TextInput
                label="Street Address"
                placeholder="123 Roaster St, Suite 4B"
                required
                leftSection={<IconMapPin size={16} stroke={1.5} />}
                {...form.getInputProps('address')}
              />

              <Grid>
                <Grid.Col span={{ base: 12, sm: 7 }}>
                  <TextInput
                    label="City"
                    placeholder="Portland"
                    required
                    leftSection={<IconBuildingCommunity size={16} stroke={1.5} />}
                    {...form.getInputProps('city')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 5 }}>
                  <TextInput
                    label="Postal Code"
                    placeholder="97201"
                    maxLength={6}
                    required
                    leftSection={<IconMailbox size={16} stroke={1.5} />}
                    {...form.getInputProps('post_code')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Country"
                    placeholder="United States"
                    required
                    leftSection={<IconWorld size={16} stroke={1.5} />}
                    {...form.getInputProps('country')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Phone Number"
                    placeholder="+1 (555) 019-2834"
                    type="tel"
                    required
                    leftSection={<IconDeviceLandlinePhone size={16} stroke={1.5} />}
                    {...form.getInputProps('phone')}
                  />
                </Grid.Col>
              </Grid>

              <Group justify="space-between" align="center" mt="md">
                <Anchor
                  href="/"
                  size="sm"
                  c="dimmed"
                  underline="hover"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <IconArrowLeft size={14} stroke={1.5} /> Back to Store
                </Anchor>

                <Group gap="xs">
                  {isEditing && (
                    <Button
                      variant="subtle"
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={handleDelete}
                      loading={isDeleting}
                    >
                      Delete
                    </Button>
                  )}
                  <Button type="submit" color="coffee" loading={isSubmitting}>
                    {isEditing ? 'Save Changes' : 'Save Address'}
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}
