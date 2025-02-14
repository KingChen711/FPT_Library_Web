// import getCategories from "@/queries/categories/get-public-categories"
import getCategories from "@/queries/categories/get-categories"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { splitCamelCase } from "@/lib/utils"

import BannerHome from "./_components/banner"
import BookList from "./_components/book-list"

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslations("HomePage")

  const categories = await getCategories()

  return (
    <div className="grid w-full gap-4">
      <BannerHome />
      <h1 className="mt-8 text-center text-2xl font-semibold text-primary">
        {t("welcome")}
      </h1>

      {categories?.map((category) => (
        <BookList
          key={category.categoryId}
          categoryId={category.categoryId}
          title={
            locale === "vi"
              ? category.vietnameseName
              : splitCamelCase(category.englishName)
          }
        />
      ))}
    </div>
  )
}
