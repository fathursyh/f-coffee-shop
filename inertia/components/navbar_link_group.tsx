import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { IconChevronRight } from '@tabler/icons-react'
import { Badge, Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core'
import { Link, useTuyau } from '@adonisjs/inertia/react'
import { routes } from '@generated/registry'
import { type RouteProps } from '~/types'
import classes from './navbar_link_group.module.css'

export interface LinksGroupProps {
  icon: React.ComponentType<{ size?: number; stroke?: number }>
  label: string
  link?: RouteProps
  badge?: string
  initiallyOpened?: boolean
  links?: { label: string; link: RouteProps; badge?: string }[]
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
  const tuyau = useTuyau()
  const { url } = usePage()

  const hasLinks = Array.isArray(links) && links.length > 0

  /**
   * Evaluates whether a target route or path matches the current active route.
   */
  const isRouteActive = (target?: RouteProps | string, exact = false): boolean => {
    if (!target || typeof target !== 'string') return false

    // Normalize current path from Inertia's reactive usePage().url
    const currentPath = (url || '').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'

    // 1. Direct path / anchor matching (e.g. '/admin/dashboard' or '/#brew-guide')
    if (target.startsWith('/') || target.startsWith('#')) {
      const cleanTarget = target.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'
      return (
        currentPath === cleanTarget ||
        (!exact &&
          cleanTarget !== '/' &&
          cleanTarget !== '/admin' &&
          currentPath.startsWith(`${cleanTarget}/`))
      )
    }

    // 2. Exact pattern match using generated AdonisJS route registry
    const routeDef = (routes as Record<string, { pattern: string } | undefined>)[target]
    if (routeDef?.pattern) {
      const routePattern = routeDef.pattern.replace(/\/+$/, '') || '/'
      if (currentPath === routePattern) return true
      if (
        !exact &&
        routePattern !== '/' &&
        routePattern !== '/admin' &&
        currentPath.startsWith(`${routePattern}/`)
      ) {
        return true
      }
    }

    // 3. Tuyau route matching
    if (tuyau && typeof tuyau.current === 'function') {
      try {
        if (tuyau.current(target as any)) return true
      } catch {
        // Fall through
      }
    }

    // 4. Fallback convention match (e.g. 'admin.dashboard' -> '/admin/dashboard')
    const convertedPath =
      ('/' + target.replace(/\.index$/, '').replace(/\./g, '/')).replace(/\/+$/, '') || '/'

    return (
      currentPath === convertedPath ||
      (!exact &&
        convertedPath !== '/' &&
        convertedPath !== '/admin' &&
        currentPath.startsWith(`${convertedPath}/`))
    )
  }

  // Exact sub-match prevents highlighting sibling routes simultaneously
  const hasExactSubMatch = Boolean(hasLinks && links?.some((sub) => isRouteActive(sub.link, true)))

  // Parent group active state
  const isSubActive = Boolean(hasLinks && links?.some((sub) => isRouteActive(sub.link, false)))

  const [opened, setOpened] = useState(Boolean(initiallyOpened || isSubActive))

  // Direct active state for single links
  const isDirectActive = Boolean(!hasLinks && link && isRouteActive(link, false))

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  const items = (hasLinks ? links : []).map((subItem) => {
    const isLinkActive = hasExactSubMatch
      ? isRouteActive(subItem.link, true)
      : isRouteActive(subItem.link, false)

    return (
      <Link
        route={subItem.link ?? 'admin.dashboard'}
        key={subItem.label}
        data-active={isLinkActive || undefined}
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
        route={link}
        onClick={handleLinkClick}
        data-active={isDirectActive || undefined}
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
        data-active={isSubActive || undefined}
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
