
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({
  tenantSlug,
  productId,
  isPurchased,
}: CartButtonProps) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        variant={"eleveted"}
        asChild
        className="flex-1 font-medium bg-white"
      >
        <Link
          prefetch
          href={`/library/${productId}`}
        >
          View in Library
        </Link>
      </Button>
    )
  }

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
