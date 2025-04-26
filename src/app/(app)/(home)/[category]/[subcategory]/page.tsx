import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{
    subcategory: string
  }>,
  searchParams: Promise<SearchParams>
}

export const dynamic = "force-dynamic"

const SubcategoryPage = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  console.log(JSON.stringify(filters), "THIS IS FROM RSC")

  const queryClent = getQueryClient();

  void queryClent.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    category: subcategory,
    limit: DEFAULT_LIMIT
  }))

  return (
    <HydrationBoundary state={dehydrate(queryClent)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  )
}

export default SubcategoryPage