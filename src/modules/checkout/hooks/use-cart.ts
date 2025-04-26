import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const {
    getCardByTenant,
    addProduct,
    removeProduct,
    clearCard,
    clearAllCard
  } = useCartStore();

  const productIds = getCardByTenant(tenantSlug)

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId)
    } else {
      addProduct(tenantSlug, productId)
    }
  }

  const isProductInCard = (productId: string) => {
    return productIds.includes(productId)
  }

  const clearTenantCard = () => {
    clearCard(tenantSlug)
  }

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => addProduct(tenantSlug, productId),
    clearCard: clearTenantCard,
    clearAllCard,
    toggleProduct,
    isProductInCard,
    totalItems: productIds.length,
  };
};