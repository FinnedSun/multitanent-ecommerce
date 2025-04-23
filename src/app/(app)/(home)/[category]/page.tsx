
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
  params: Promise<{
    category: string
  }>,
  searchParams: Promise<SearchParams>
}

export const dynamic = "force-dynamic"

const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);


  const queryClent = getQueryClient();

  void queryClent.prefetchQuery(trpc.products.getMany.queryOptions({
    category,
    ...filters,
  }))

  return (
    <HydrationBoundary state={dehydrate(queryClent)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  )
}

export default CategoryPage