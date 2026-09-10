import { useMemo, useState } from 'react'
import { Box } from '@mantine/core'
import { toast } from 'sonner'
import HomeHero from '~/components/home/hero'
import OrderCatalog, {
  type CoffeeBean,
  type CartItem,
  type BeanSelection,
  GRIND_OPTIONS,
} from '~/components/home/order_catalog'
import RoasteryStandard from '~/components/home/roastery_standard'
import BrewGuide from '~/components/home/brew_guide'
import CupGuarantee from '~/components/home/cup_guarantee'
import CartBar from '~/components/home/cart_bar'
import OrderDrawer from '~/components/home/order_drawer'

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false)

  const totalCartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  )

  const handleAddToCart = (bean: CoffeeBean, selection: BeanSelection) => {
    const unitPrice = getBeanPrice(bean.basePrice250g, selection.weight)
    const cartItemId = `${bean.id}-${selection.weight}-${selection.grind}`

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId)
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + selection.quantity } : item
        )
      }
      return [
        ...prev,
        {
          id: cartItemId,
          coffeeId: bean.id,
          name: bean.name,
          origin: bean.origin,
          roast: bean.roast,
          weight: selection.weight,
          grind:
            GRIND_OPTIONS.find((g) => g.value === selection.grind)?.label.split(' (')[0] ||
            'Whole Bean',
          price: unitPrice,
          quantity: selection.quantity,
        },
      ]
    })

    toast.success(`Added ${selection.quantity}x ${bean.name} (${selection.weight}) to your bag`)
  }

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const next = item.quantity + delta
            return next > 0 ? { ...item, quantity: next } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    )
  }

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId))
  }

  const handleConfirmOrder = () => {
    setCart([])
  }

  const getBeanPrice = (basePrice: number, weight: '250g' | '500g' | '1kg'): number => {
    switch (weight) {
      case '500g':
        return +(basePrice * 1.88).toFixed(2)
      case '1kg':
        return +(basePrice * 3.5).toFixed(2)
      default:
        return basePrice
    }
  }

  return (
    <Box bg="coffee.0">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Coffee Ordering Catalog */}
      <OrderCatalog onAddToCart={handleAddToCart} />

      {/* 3. Roastery Standards */}
      <RoasteryStandard />

      {/* 4. Brew Guide */}
      <BrewGuide />

      {/* 5. Cup Guarantee */}
      <CupGuarantee />

      {/* 6. Sticky Cart Bar */}
      {totalCartCount > 0 && (
        <CartBar
          totalCount={totalCartCount}
          subtotal={cartSubtotal}
          onCheckout={() => setDrawerOpened(true)}
        />
      )}

      {/* 7. Order Drawer */}
      <OrderDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        cart={cart}
        cartSubtotal={cartSubtotal}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onConfirmOrder={handleConfirmOrder}
      />
    </Box>
  )
}
