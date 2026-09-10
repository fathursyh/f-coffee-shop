import { Form } from '@adonisjs/inertia/react'
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconCoffee, IconLock, IconLockCheck, IconMail, IconUser } from '@tabler/icons-react'

export default function Signup() {
  return (
    <Box bg="coffee.0" py="xl" style={{ display: 'flex', alignItems: 'center' }}>
      <Container size={440} w="100%">
        {/* Café Header */}
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={56} radius="xl" variant="light" color="coffee">
            <IconCoffee size={30} stroke={1.75} />
          </ThemeIcon>

          <Title order={1} c="coffee.9">
            Join the Roastery
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            Create an account to start earning coffee beans & rewards.
          </Text>
        </Stack>

        {/* Signup Card */}
        <Paper p={36}>
          <Form route="new_account.store" noValidate>
            {({ errors, processing }) => (
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="Jane Barista"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  required
                  error={errors.fullName}
                  leftSection={<IconUser size={16} stroke={1.5} />}
                />

                <TextInput
                  label="Email Address"
                  placeholder="jane@example.com"
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  error={errors.email}
                  leftSection={<IconMail size={16} stroke={1.5} />}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  error={errors.password}
                  leftSection={<IconLock size={16} stroke={1.5} />}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  required
                  error={errors.passwordConfirmation}
                  leftSection={<IconLockCheck size={16} stroke={1.5} />}
                />

                <Button type="submit" fullWidth mt="sm" loading={processing}>
                  Create Account
                </Button>
              </Stack>
            )}
          </Form>

          <Divider my="lg" label="already have an account?" labelPosition="center" />

          <Center>
            <Text size="sm" c="dimmed">
              Already brewing with us?{' '}
              <Anchor href="/login" fw={600} c="coffee.7" underline="hover">
                Log in
              </Anchor>
            </Text>
          </Center>
        </Paper>
      </Container>
    </Box>
  )
}
