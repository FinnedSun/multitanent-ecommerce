import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/products-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    subcategory: string
  }>
}

export const dynamic = "force-dynamic"

const SubcategoryPage = async ({ params }: Props) => {
  const { subcategory } = await params;

  const queryClent = getQueryClient();

  void queryClent.prefetchQuery(trpc.products.getMany.queryOptions({ category: subcategory }))

  return (
    <HydrationBoundary state={dehydrate(queryClent)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default SubcategoryPage