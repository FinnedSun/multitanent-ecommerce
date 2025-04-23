import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/products-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    category: string
  }>
}

export const dynamic = "force-dynamic"

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;

  const queryClent = getQueryClient();

  void queryClent.prefetchQuery(trpc.products.getMany.queryOptions({ category }))

  return (
    <HydrationBoundary state={dehydrate(queryClent)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default CategoryPage