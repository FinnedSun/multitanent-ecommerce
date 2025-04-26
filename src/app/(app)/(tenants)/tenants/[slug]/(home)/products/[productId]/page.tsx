import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ProductIdProps {
  params: Promise<{
    productId: string
    slug: string
  }>
}


const ProductId = async ({
  params
}: ProductIdProps) => {
  const { productId, slug } = await params;

  const queryClent = getQueryClient();
  void queryClent.prefetchQuery(trpc.tenants.getOne.queryOptions({
    slug
  }))
  return (
    <HydrationBoundary state={dehydrate(queryClent)}>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  )
}
export default ProductId;
