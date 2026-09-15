import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { IconChevronRight } from '@tabler/icons-react'
import { Badge, Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core'
import classes from './navbar_link_group.module.css'
import { Link } from '@adonisjs/inertia/react'

export interface LinksGroupProps {
  icon: React.ComponentType<{ size?: number; stroke?: number }>
  label: string
  link?: string
  badge?: string
  initiallyOpened?: boolean
  links?: { label: string; link: string; badge?: string }[]
  onNavigate?: () => void
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  badge,
  initiallyOpened,
  links,
  onNavigate,
}: LinksGroupProps) {
  const { url } = usePage()
  const hasLinks = Array.isArray(links) && links.length > 0

  const isSubActive =
    hasLinks &&
    links.some((sub) => url === sub.link || (sub.link !== '/' && url.startsWith(sub.link)))
  const [opened, setOpened] = useState(initiallyOpened || isSubActive || false)

  const isDirectActive = Boolean(link && (url === link || (link !== '/' && url.startsWith(link))))

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  const items = (hasLinks ? links : []).map((subItem) => {
    const isLinkActive =
      url === subItem.link || (subItem.link !== '/' && url.startsWith(subItem.link))
    return (
      <Link
        href={subItem.link}
        key={subItem.label}
        className={`${classes.link} ${isLinkActive ? classes.activeLink : ''}`}
        onClick={handleLinkClick}
      >
        <Group justify="space-between" wrap="nowrap">
          <span>{subItem.label}</span>
          {subItem.badge && (
            <Badge size="xs" variant="light" color="coffee">
              {subItem.badge}
            </Badge>
          )}
        </Group>
      </Link>
    )
  })

  // Case 1: Simple link without sub-menu
  if (!hasLinks && link) {
    return (
      <UnstyledButton
        component={Link}
        href={link}
        onClick={handleLinkClick}
        className={`${classes.control} ${isDirectActive ? classes.activeControl : ''}`}
      >
        <Group justify="space-between" gap={0} wrap="nowrap">
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon
              variant={isDirectActive ? 'filled' : 'light'}
              color="coffee"
              size={30}
              radius="md"
            >
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {badge && (
            <Badge size="xs" variant="filled" color="coffee.7">
              {badge}
            </Badge>
          )}
        </Group>
      </UnstyledButton>
    )
  }

  // Case 2: Group with expandable sub-links
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={`${classes.control} ${isSubActive ? classes.activeControlParent : ''}`}
      >
        <Group justify="space-between" gap={0} wrap="nowrap">
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon
              variant={isSubActive ? 'filled' : 'light'}
              color="coffee"
              size={30}
              radius="md"
            >
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          <Group gap={6} wrap="nowrap">
            {badge && (
              <Badge size="xs" variant="light" color="coffee">
                {badge}
              </Badge>
            )}
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={15}
              style={{ transform: opened ? 'rotate(90deg)' : 'none' }}
            />
          </Group>
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse expanded={opened}>{items}</Collapse> : null}
    </>
  )
}
