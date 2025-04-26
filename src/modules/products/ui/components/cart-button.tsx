
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
}

export const CartButton = ({
  tenantSlug,
  productId,
}: CartButtonProps) => {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant="eleveted"
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId)
        ? "Remove form cart"
        : "Add to cart"
      }
    </Button>
  )
}
