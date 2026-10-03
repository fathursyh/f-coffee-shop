import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Image,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import {
  IconCoffee,
  IconEdit,
  IconFlame,
  IconPackage,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'

export type CoffeeItem = {
  id: string
  slug: string
  name: string
  origin: string
  subregion: string | null
  elevation: string | null
  process: string | null
  roast: string
  roastLevel: number
  tastingNotes: string[]
  description: string | null
  bestFor: string | null
  basePrice250G: number
  badge: string | null
  stockQuantity: number
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export type CoffeeDataProps = {
  coffees: {
    data: CoffeeItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: {
    search?: string
    status?: string
  }
}

const COMMON_TASTING_NOTES = [
  'Chocolate',
  'Milk Chocolate',
  'Dark Cocoa',
  'Caramel',
  'Toffee',
  'Vanilla',
  'Honey',
  'Brown Sugar',
  'Bergamot',
  'Jasmine Blossom',
  'Wild Peach',
  'Red Cherry',
  'Blackberry',
  'Citrus',
  'Orange',
  'Red Gala Apple',
  'Toasted Almond',
  'Hazelnut',
  'Pecan',
  'Cedarwood',
  'Baking Spice',
  'Cacao Nibs',
]

export default function CoffeeData({ coffees, filters }: CoffeeDataProps) {
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || 'ALL')
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [editingCoffee, setEditingCoffee] = useState<CoffeeItem | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const form = useForm({
    initialValues: {
      name: '',
      slug: '',
      origin: '',
      subregion: '',
      elevation: '',
      process: '',
      roast: 'Medium',
      roastLevel: 3,
      tastingNotes: [] as string[],
      description: '',
      bestFor: '',
      basePrice250G: 18.0,
      badge: '',
      stockQuantity: 50,
      imageUrl: '',
      isActive: true,
    },
    validate: {
      name: (val) => (val.trim().length >= 2 ? null : 'Name must be at least 2 characters'),
      origin: (val) => (val.trim().length >= 2 ? null : 'Origin is required'),
      roast: (val) => (val.trim() ? null : 'Roast profile is required'),
      basePrice250G: (val) => (val > 0 ? null : 'Price must be greater than 0'),
      tastingNotes: (val) => (val.length > 0 ? null : 'Select at least one tasting note'),
    },
  })

  const handleOpenCreate = () => {
    setEditingCoffee(null)
    form.reset()
    openModal()
  }

  const handleOpenEdit = (item: CoffeeItem) => {
    setEditingCoffee(item)
    form.setValues({
      name: item.name,
      slug: item.slug || item.id,
      origin: item.origin,
      subregion: item.subregion || '',
      elevation: item.elevation || '',
      process: item.process || '',
      roast: item.roast,
      roastLevel: item.roastLevel,
      tastingNotes: Array.isArray(item.tastingNotes) ? item.tastingNotes : [],
      description: item.description || '',
      bestFor: item.bestFor || '',
      basePrice250G: Number(item.basePrice250G),
      badge: item.badge || '',
      stockQuantity: item.stockQuantity,
      imageUrl: item.imageUrl || '',
      isActive: item.isActive,
    })
    openModal()
  }

  const handleSubmit = (values: typeof form.values) => {
    if (editingCoffee) {
      router.patch(`/admin/coffees/${editingCoffee.id}`, values, {
        onSuccess: () => {
          closeModal()
        },
      })
    } else {
      router.post('/admin/coffees', values, {
        onSuccess: () => {
          closeModal()
          form.reset()
        },
      })
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return
    }
    setIsDeleting(id)
    router.delete(`/admin/coffees/${id}`, {
      onFinish: () => setIsDeleting(null),
    })
  }

  const handleToggleActive = (item: CoffeeItem) => {
    router.patch(
      `/admin/coffees/${item.id}`,
      { isActive: !item.isActive },
      { preserveScroll: true }
    )
  }

  const handleFilter = (newSearch?: string, newStatus?: string, page: number = 1) => {
    router.get(
      '/admin/coffees',
      {
        search: newSearch !== undefined ? newSearch : search,
        status: newStatus !== undefined ? newStatus : statusFilter,
        page,
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  return (
    <Box bg="coffee.0" py={{ base: 'md', md: 'xl' }} style={{ minHeight: '100dvh' }}>
      <Container size="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="center" wrap="wrap">
            <Box>
              <Badge variant="outline" color="coffee" size="sm" mb={4} leftSection={<IconCoffee size={12} />}>
                Roastery Inventory
              </Badge>
              <Title order={2} c="coffee.9">
                Coffee Bean Catalog
              </Title>
              <Text size="sm" c="coffee.7">
                Manage your single-origins, seasonal lots, prices, stock levels, and active offerings.
              </Text>
            </Box>

            <Button
              color="coffee"
              leftSection={<IconPlus size={16} />}
              onClick={handleOpenCreate}
            >
              Add Coffee Bean
            </Button>
          </Group>

          {/* Filters & Search */}
          <Paper p="md" radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-coffee-2)' }}>
            <Group justify="space-between" wrap="wrap" gap="sm">
              <TextInput
                placeholder="Search coffee name, origin, roast..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value)
                  handleFilter(e.currentTarget.value, statusFilter, 1)
                }}
                style={{ flex: 1, minWidth: 260 }}
              />

              <Select
                data={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'ACTIVE', label: 'Active Only' },
                  { value: 'INACTIVE', label: 'Inactive / Hidden' },
                ]}
                value={statusFilter}
                onChange={(val) => {
                  const s = val || 'ALL'
                  setStatusFilter(s)
                  handleFilter(search, s, 1)
                }}
                w={180}
              />
            </Group>
          </Paper>

          {/* Table */}
          <Paper radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-coffee-2)', overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={850}>
              <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                <Table.Thead bg="coffee.1">
                  <Table.Tr>
                    <Table.Th>Coffee</Table.Th>
                    <Table.Th>Origin &amp; Process</Table.Th>
                    <Table.Th>Roast Profile</Table.Th>
                    <Table.Th>Base Price (250g)</Table.Th>
                    <Table.Th>Stock (Bags)</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {coffees.data.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed" size="sm">
                          No coffee beans found matching the filter criteria.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    coffees.data.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                w={42}
                                h={42}
                                radius="md"
                                fit="cover"
                                fallbackSrc="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&auto=format&fit=crop&q=60"
                              />
                            ) : (
                              <ThemeIcon size={42} radius="md" color="coffee" variant="light">
                                <IconPackage size={22} />
                              </ThemeIcon>
                            )}
                            <Box>
                              <Group gap={6} align="center">
                                <Text fw={600} size="sm" c="coffee.9">
                                  {item.name}
                                </Text>
                                {item.badge && (
                                  <Badge size="xs" color="coffee" variant="filled">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Group>
                              <Text size="xs" c="dimmed">
                                slug: {item.slug || item.id}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>

                        <Table.Td>
                          <Text size="sm" fw={500} c="coffee.9">
                            {item.origin}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {item.process || 'Standard'} {item.elevation ? `· ${item.elevation}` : ''}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Badge
                            size="sm"
                            variant="light"
                            color="coffee"
                            leftSection={<IconFlame size={12} />}
                          >
                            {item.roast} (Lv {item.roastLevel})
                          </Badge>
                        </Table.Td>

                        <Table.Td>
                          <Text fw={600} size="sm" c="coffee.9">
                            ${Number(item.basePrice250G).toFixed(2)}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Badge
                            size="sm"
                            variant="outline"
                            color={item.stockQuantity <= 0 ? 'red' : item.stockQuantity < 15 ? 'orange' : 'teal'}
                          >
                            {item.stockQuantity <= 0 ? 'Out of Stock' : `${item.stockQuantity} in stock`}
                          </Badge>
                        </Table.Td>

                        <Table.Td>
                          <Tooltip label={item.isActive ? 'Click to deactivate' : 'Click to activate'}>
                            <Switch
                              checked={item.isActive}
                              onChange={() => handleToggleActive(item)}
                              color="teal"
                              size="sm"
                            />
                          </Tooltip>
                        </Table.Td>

                        <Table.Td align="right">
                          <Group gap={4} justify="flex-end">
                            <Tooltip label="Edit Details">
                              <ActionIcon
                                variant="subtle"
                                color="coffee"
                                onClick={() => handleOpenEdit(item)}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete Bean">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                loading={isDeleting === item.id}
                                onClick={() => handleDelete(item.id, item.name)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {coffees.meta.lastPage > 1 && (
              <Group justify="space-between" p="md" style={{ borderTop: '1px solid var(--mantine-color-coffee-2)' }}>
                <Text size="xs" c="dimmed">
                  Showing page {coffees.meta.currentPage} of {coffees.meta.lastPage} ({coffees.meta.total} coffees)
                </Text>
                <Pagination
                  total={coffees.meta.lastPage}
                  value={coffees.meta.currentPage}
                  onChange={(page) => handleFilter(search, statusFilter, page)}
                  color="coffee"
                  size="sm"
                />
              </Group>
            )}
          </Paper>
        </Stack>
      </Container>

      {/* Create / Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Group gap="xs">
            <ThemeIcon color="coffee" size="sm" variant="light">
              <IconCoffee size={16} />
            </ThemeIcon>
            <Text fw={700} c="coffee.9">
              {editingCoffee ? `Edit: ${editingCoffee.name}` : 'New Coffee Bean'}
            </Text>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Coffee Name"
                placeholder="e.g. Guji Highland Flora"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Slug (URL identifier)"
                placeholder="Auto-generated if empty"
                {...form.getInputProps('slug')}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <TextInput
                label="Origin Country"
                placeholder="e.g. Ethiopia"
                required
                {...form.getInputProps('origin')}
              />
              <TextInput
                label="Subregion / Farm"
                placeholder="e.g. Uraga, Guji Zone"
                {...form.getInputProps('subregion')}
              />
              <TextInput
                label="Elevation"
                placeholder="e.g. 2,150 MASL"
                {...form.getInputProps('elevation')}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <TextInput
                label="Processing Method"
                placeholder="e.g. Washed / Natural"
                {...form.getInputProps('process')}
              />
              <Select
                label="Roast Type"
                data={['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark']}
                required
                {...form.getInputProps('roast')}
              />
              <NumberInput
                label="Roast Level (1-5)"
                min={1}
                max={5}
                step={0.5}
                required
                {...form.getInputProps('roastLevel')}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <NumberInput
                label="Base Price 250g ($)"
                min={0.01}
                step={0.5}
                decimalScale={2}
                required
                {...form.getInputProps('basePrice250G')}
              />
              <NumberInput
                label="Stock Quantity (Bags)"
                min={0}
                required
                {...form.getInputProps('stockQuantity')}
              />
              <TextInput
                label="Marketing Badge"
                placeholder="e.g. Roaster's Pick, Seasonal"
                {...form.getInputProps('badge')}
              />
            </SimpleGrid>

            <TagsInput
              label="Tasting Notes"
              placeholder="Type a note and press Enter (or select suggestions)"
              data={COMMON_TASTING_NOTES}
              required
              {...form.getInputProps('tastingNotes')}
            />

            <TextInput
              label="Image URL"
              placeholder="https://images.unsplash.com/..."
              {...form.getInputProps('imageUrl')}
            />

            <TextInput
              label="Best Brew Methods"
              placeholder="e.g. V60, Chemex, Aeropress, Espresso"
              {...form.getInputProps('bestFor')}
            />

            <Textarea
              label="Flavor Profile & Terroir Description"
              placeholder="Detailed flavor notes, producer story, cupping profile..."
              rows={3}
              {...form.getInputProps('description')}
            />

            <Switch
              label="Active & Available in Storefront Catalog"
              {...form.getInputProps('isActive', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" color="coffee">
                {editingCoffee ? 'Save Changes' : 'Create Coffee'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  )
}
