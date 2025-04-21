interface Props {
  params: Promise<{
    category: string,
    subcategory: string
  }>
}

export const dynamic = "force-dynamic"

const SubcategoryPage = async ({ params }: Props) => {
  const { category, subcategory } = await params;

  return (
    <div>
      <div>
        category: {category}
      </div>
      <div>
        subcategory: {subcategory}
      </div>
    </div>
  )
}

export default SubcategoryPage