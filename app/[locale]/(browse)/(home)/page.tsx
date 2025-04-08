import { Suspense } from "react"
import { auth } from "@/queries/auth"
import getCategories from "@/queries/categories/get-public-categories"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { getFullName, splitCamelCase } from "@/lib/utils"
import BrowseBookCardSkeleton from "@/components/ui/browse-book-card"

import BannerHome from "./_components/banner"
import BookList from "./_components/book-list"
import RecentBookList from "./_components/recent-book-list"

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslations("HomePage")
  const categories = await getCategories()
  const user = await auth().whoAmI()

  return (
    <div className="container grid w-full gap-4">
      <BannerHome />
      <h1 className="mt-4 text-center text-2xl font-semibold text-foreground">
        👋{" "}
        {user
          ? t("welcome user", {
              userName: getFullName(user.firstName, user.lastName),
            })
          : t("welcome")}
      </h1>
      <RecentBookList />
      {categories?.map((category) => (
        <Suspense
          key={category.categoryId}
          fallback={
            <>
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <BrowseBookCardSkeleton key={i} />
                ))}
            </>
          }
        >
          <BookList
            categoryId={category.categoryId}
            title={
              locale === "vi"
                ? category.vietnameseName
                : splitCamelCase(category.englishName)
            }
          />
        </Suspense>
      ))}
    </div>
  )
}
