import { Form } from '@adonisjs/inertia/react'
import {
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconCoffee, IconLock, IconMail } from '@tabler/icons-react'
import classes from './auth.module.css'

export default function Login() {
  return (
    <Box bg="coffee.0" py="xl" className={classes.pageWrapper}>
      <Container size={440} w="100%">
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={56} radius="xl" variant="light" color="coffee">
            <IconCoffee size={30} stroke={1.75} />
          </ThemeIcon>

          <Title order={1} c="coffee.9">
            Welcome Back
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            Freshly roasted beans and your daily brew await.
          </Text>
        </Stack>

        {/* Login Surface */}
        <Paper p={36}>
          <Form route="session.store" noValidate>
            {({ errors, processing }) => (
              <Stack gap="md">
                <TextInput
                  label="Email Address"
                  placeholder="barista@yourcafename.com"
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username"
                  required
                  error={errors.email}
                  leftSection={<IconMail size={16} stroke={1.5} />}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  error={errors.password}
                  leftSection={<IconLock size={16} stroke={1.5} />}
                />

                <Group justify="space-between" mt={4}>
                  <Checkbox label="Remember me" size="xs" color="coffee" />
                  <Anchor href="#" size="xs" c="coffee.6" underline="hover">
                    Forgot password?
                  </Anchor>
                </Group>

                <Button type="submit" fullWidth mt="sm" loading={processing}>
                  Sign In to Brew
                </Button>
              </Stack>
            )}
          </Form>

          <Divider my="lg" label="new to our roastery?" labelPosition="center" />

          <Center>
            <Text size="sm" c="dimmed">
              Don&apos;t have an account?{' '}
              <Anchor href="/register" fw={600} c="coffee.7" underline="hover">
                Create one
              </Anchor>
            </Text>
          </Center>
        </Paper>
      </Container>
    </Box>
  )
}
