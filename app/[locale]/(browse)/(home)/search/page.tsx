"use client"

import { useTranslations } from "next-intl"

import BookFilterTabs from "@/components/book-filter-tabs"

const SearchPage = () => {
  const t = useTranslations("BasicSearchTab")

  return (
    <div className="flex size-full flex-col justify-center gap-4">
      <section className="flex-1 space-y-2">
        <h1 className="text-2xl font-semibold">
          {t("Search for articles, books, journals, and other content")}
        </h1>
        {/* <SheetSearchBook /> */}
        <BookFilterTabs autoComplete />
      </section>
    </div>
  )
}

export default SearchPage
