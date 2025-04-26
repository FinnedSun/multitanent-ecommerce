
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface CardButtonProps {
  tenantSlug: string;
  productId: string;
}

export const CardButton = ({
  tenantSlug,
  productId,
}: CardButtonProps) => {
  const card = useCart(tenantSlug);

  return (
    <Button
      variant="eleveted"
      className={cn(
        "flex-1 bg-pink-400",
        card.isProductInCard(productId) && "bg-white"
      )}
      onClick={() => card.toggleProduct(productId)}
    >
      {card.isProductInCard(productId)
        ? "Remove form card"
        : "Add to card"
      }
    </Button>
  )
}
