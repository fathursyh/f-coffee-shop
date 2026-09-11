import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'
import type { InertiaProps } from '~/types'
import type { RoastType } from '#database/migrations/1789048820298_create_carts_table'
import { type BeanSelection, GRIND_OPTIONS } from '~/components/home/order_catalog'
import type Cart from '#models/cart'
import type Coffee from '#models/coffee'

const SESSION_CART_KEY = 'f_coffee_cart' as const

const getSessionCart = (): Cart[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(SESSION_CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveSessionCart = (items: Cart[]) => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SESSION_CART_KEY, JSON.stringify(items))
  } catch {}
}

const clearSessionCart = () => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(SESSION_CART_KEY)
  } catch {}
}

const getBeanPrice = (basePrice: number = 0, weight: '250g' | '500g' | '1kg'): number => {
  switch (weight) {
    case '500g':
      return +(basePrice * 1.88).toFixed(2)
    case '1kg':
      return +(basePrice * 3.5).toFixed(2)
    default:
      return +basePrice.toFixed(2)
  }
}

export default function useCart(dbCart: Cart[] = []) {
  const router = useRouter()
  const { user } = usePage<InertiaProps>().props
  const [guestCart, setGuestCart] = useState<Cart[]>(() => (user ? [] : getSessionCart()))
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false)
  const isSyncing = useRef(false)

  useEffect(() => {
    if (!user || isSyncing.current) return

    const sessionItems = getSessionCart()
    if (sessionItems.length === 0) return

    isSyncing.current = true
    clearSessionCart()

    router.post(
      { route: 'carts.sync' },
      { items: sessionItems as any },
      {
        preserveScroll: true,
        onSuccess: () => {
          setGuestCart([])
          isSyncing.current = false
        },
        onError: () => {
          saveSessionCart(sessionItems)
          setGuestCart(sessionItems)
          isSyncing.current = false
        },
      }
    )
  }, [router, user])

  const cart = user ? dbCart : guestCart

  const handleAddToCart = (bean: Coffee, selection: BeanSelection) => {
    const basePrice = Number(bean.basePrice250G ?? 0)
    const unitPrice = getBeanPrice(basePrice, selection.weight)
    const grindOption = GRIND_OPTIONS.find((g) => g.value === selection.grind)
    const grindLabel = grindOption ? grindOption.label.split(' (')[0] : 'Whole Bean'

    if (user) {
      router.post(
        { route: 'carts.store' },
        {
          coffeeId: bean.id,
          weight: selection.weight,
          grind: grindLabel,
          quantity: selection.quantity,
          price: unitPrice,
          roast: bean.roast,
          roastType: bean.roast,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(
              `Added ${selection.quantity}x ${bean.name} (${selection.weight}) to your bag`
            )
          },
        }
      )
    } else {
      const cartItemId = `${bean.id}-${selection.weight}-${selection.grind}`
      const current = getSessionCart()
      const existing = current.find((item) => String(item.id) === cartItemId)
      let nextCart: Cart[]

      if (existing) {
        nextCart = current.map((item) =>
          String(item.id) === cartItemId
            ? { ...item, quantity: item.quantity + selection.quantity }
            : item
        )
      } else {
        nextCart = [
          ...current,
          {
            id: cartItemId as unknown as number,
            coffeeId: bean.id,
            weight: selection.weight,
            grind: grindLabel,
            price: unitPrice,
            quantity: selection.quantity,
            roastType: bean.roast as RoastType,
            coffee: bean,
          } as unknown as Cart,
        ]
      }

      saveSessionCart(nextCart)
      setGuestCart(nextCart)
      toast.success(`Added ${selection.quantity}x ${bean.name} (${selection.weight}) to your bag`)
    }
  }

  const handleUpdateCartQuantity = (cartItemId: string | number, delta: number) => {
    if (user) {
      router.patch(
        { route: 'carts.update', routeParams: { id: cartItemId } },
        { delta },
        { preserveScroll: true }
      )
    } else {
      const current = getSessionCart()
      const nextCart = current.flatMap((item) => {
        if (String(item.id) !== String(cartItemId)) return [item]
        const next = item.quantity + delta
        return next > 0 ? [{ ...item, quantity: next }] : []
      })
      saveSessionCart(nextCart)
      setGuestCart(nextCart)
    }
  }

  const handleRemoveCartItem = (cartItemId: string | number) => {
    if (user) {
      router.delete(
        { route: 'carts.destroy', routeParams: { id: cartItemId } },
        { preserveScroll: true }
      )
    } else {
      const current = getSessionCart()
      const nextCart = current.filter((item) => String(item.id) !== String(cartItemId))
      saveSessionCart(nextCart)
      setGuestCart(nextCart)
    }
  }

  const handleConfirmOrder = () => {
    if (user) {
      router.delete(
        { route: 'carts.clear' },
        {
          preserveScroll: true,
          onSuccess: () => {
            setDrawerOpened(false)
          },
        }
      )
    } else {
      clearSessionCart()
      setGuestCart([])
      setDrawerOpened(false)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please log in to review your order and checkout.')
      router.get({ route: 'session.create' })
      return
    }
    setDrawerOpened(true)
  }

  const totalCartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
    [cart]
  )

  return {
    cart,
    cartSubtotal,
    totalCartCount,
    drawerOpened,
    setDrawerOpened,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleConfirmOrder,
    handleCheckout,
  }
}
