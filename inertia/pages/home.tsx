import { Box } from '@mantine/core'
import HomeHero from '~/components/home/hero'
import OrderCatalog from '~/components/home/order_catalog'
import RoasteryStandard from '~/components/home/roastery_standard'
import BrewGuide from '~/components/home/brew_guide'
import CupGuarantee from '~/components/home/cup_guarantee'
import CartBar from '~/components/home/cart_bar'
import OrderDrawer from '~/components/home/order_drawer'
import useCart from '~/hooks/use_cart'
import type Cart from '#models/cart'
import type Coffee from '#models/coffee'

interface HomeProps {
  coffee: Coffee[]
  dbCart: Cart[]
}

export default function Home({ coffee, dbCart }: HomeProps) {
  const {
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
  } = useCart(dbCart)

  return (
    <Box bg="coffee.0" pb={{ base: 160, sm: 120, md: 80 }}>
      <HomeHero />
      <OrderCatalog coffee={coffee} onAddToCart={handleAddToCart} />
      <RoasteryStandard />
      <BrewGuide />
      <CupGuarantee />

      {totalCartCount > 0 && (
        <CartBar totalCount={totalCartCount} subtotal={cartSubtotal} onCheckout={handleCheckout} />
      )}

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
