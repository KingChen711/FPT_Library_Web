import React from "react"
import { auth } from "@/queries/auth"
import getCategories from "@/queries/categories/get-categories"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CategoryList from "./_components/category-list"
import ImportCategoriesDialog from "./_components/import-categories-dialog"
import MutateCategoryDialog from "./_components/mutate-category-dialog"

async function CategoriesManagementPage() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("CategoriesManagementPage")
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Categories")}</h3>
        <div className="flex items-center gap-x-4">
          <ImportCategoriesDialog />
          <MutateCategoryDialog type="create" />
        </div>
      </div>
      <CategoryList categories={categories} />
    </div>
  )
}

export default CategoriesManagementPage
