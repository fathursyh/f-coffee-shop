import { Form } from '@adonisjs/inertia/react'
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
import {
  IconArrowLeft,
  IconBuildingCommunity,
  IconDeviceLandlinePhone,
  IconMailbox,
  IconMapPin,
  IconWorld,
} from '@tabler/icons-react'
import classes from './user_info.module.css'

export default function CreateAddress() {
  return (
    <Box bg="coffee.0" py="xl" className={classes.pageWrapper}>
      <Container size={540} w="100%">
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={56} radius="xl" variant="light" color="coffee">
            <IconMapPin size={30} stroke={1.75} />
          </ThemeIcon>

          <Title order={1} c="coffee.9">
            Add Shipping Address
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            Where should we deliver your freshly roasted coffee?
          </Text>
        </Stack>

        <Paper p={36} radius="md" withBorder shadow="sm">
          <Form route="user_info.store" noValidate>
            {({ errors, processing }) => (
              <Stack gap="md">
                <TextInput
                  label="Street Address"
                  placeholder="123 Roaster St, Suite 4B"
                  name="address"
                  id="address"
                  maxLength={255}
                  required
                  error={errors.address}
                  leftSection={<IconMapPin size={16} stroke={1.5} />}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 7 }}>
                    <TextInput
                      label="City"
                      placeholder="Portland"
                      name="city"
                      id="city"
                      maxLength={50}
                      required
                      error={errors.city}
                      leftSection={<IconBuildingCommunity size={16} stroke={1.5} />}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 5 }}>
                    <TextInput
                      label="Postal Code"
                      placeholder="97201"
                      name="post_code"
                      id="post_code"
                      maxLength={6}
                      required
                      error={errors.post_code}
                      leftSection={<IconMailbox size={16} stroke={1.5} />}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Country"
                      placeholder="United States"
                      name="country"
                      id="country"
                      maxLength={50}
                      required
                      error={errors.country}
                      leftSection={<IconWorld size={16} stroke={1.5} />}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="+1 (555) 019-2834"
                      name="phone"
                      id="phone"
                      type="tel"
                      maxLength={15}
                      required
                      error={errors.phone}
                      leftSection={<IconDeviceLandlinePhone size={16} stroke={1.5} />}
                    />
                  </Grid.Col>
                </Grid>

                <Group justify="space-between" align="center" mt="md">
                  <Anchor
                    href="/addresses"
                    size="sm"
                    c="dimmed"
                    underline="hover"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <IconArrowLeft size={14} stroke={1.5} /> Cancel
                  </Anchor>

                  <Button type="submit" color="coffee" loading={processing}>
                    Save Address
                  </Button>
                </Group>
              </Stack>
            )}
          </Form>
        </Paper>
      </Container>
    </Box>
  )
}
