interface Props {
  params: Promise<{
    category: string
  }>
}

export const dynamic = "force-dynamic"

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;

  return (
    <div>
      category: {category}
    </div>
  )
}

export default CategoryPage