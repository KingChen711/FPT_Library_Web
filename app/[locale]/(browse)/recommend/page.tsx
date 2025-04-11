import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { searchRecommendSchema } from "@/lib/validations/books/search-recommend-schema"

import FilterRecommendBooks from "./_components/filter-recommend-books"
import InfinityBooks from "./_components/inifinity-books"

type Props = {
  searchParams: Record<string, string>
}

async function RecommendPage({ searchParams }: Props) {
  await auth().protect()

  const parseSearchParams = searchRecommendSchema.parse(searchParams)

  const t = await getTranslations("BookPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Recommend for you")}</h3>
        <FilterRecommendBooks />
      </div>

      <div className="mt-4">
        <InfinityBooks searchParams={parseSearchParams} />
      </div>
    </div>
  )
}

export default RecommendPage
