import React from "react"
import { auth } from "@/queries/auth"
import getCategories from "@/queries/categories/get-categories"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CategoryList from "./_components/category-list"
import MutateCategoryDialog from "./_components/mutate-category-dialog"

async function CategoriesManagementPage() {
  await auth().protect(EFeature.BOOK_MANAGEMENT)
  const t = await getTranslations("CategoriesManagementPage")
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Categories")}</h3>
        <div className="flex items-center gap-x-4">
          <MutateCategoryDialog type="create" />
        </div>
      </div>
      <CategoryList categories={categories} />
    </div>
  )
}

export default CategoriesManagementPage
