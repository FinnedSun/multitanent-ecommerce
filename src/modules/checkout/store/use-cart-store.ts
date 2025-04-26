
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface TenantCard {
  productIds: string[];
}

interface CardState {
  tenantCards: Record<string, TenantCard>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCard: (tenantSlug: string) => void;
  clearAllCard: () => void;
  getCardByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CardState>()(
  persist(
    (set, get) => ({
      tenantCards: {},
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCards: {
            ...state.tenantCards,
            [tenantSlug]: {
              productIds: [
                ...(state.tenantCards[tenantSlug]?.productIds || []),
                productId,
              ]
            }
          }
        })),
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCards: {
            ...state.tenantCards,
            [tenantSlug]: {
              productIds: state.tenantCards[tenantSlug]?.productIds.filter(
                (id) => id !== productId
              ) || [],
            }
          }
        })),
      clearCard: (tenantSlug) =>
        set((state) => ({
          tenantCards: {
            ...state.tenantCards,
            [tenantSlug]: {
              productIds: []
            },
          },
        })),
      clearAllCard: () =>
        set({
          tenantCards: {},
        }),
      getCardByTenant: (tenantSlug) =>
        get().tenantCards[tenantSlug]?.productIds || [],

    }),
    {
      name: "funroad-card",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);