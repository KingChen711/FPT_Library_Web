import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getPatrons from "@/queries/holders/get-holders"
import { Plus } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchPatronsSchema } from "@/lib/validations/holders/search-patrons"
import { Button } from "@/components/ui/button"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"

import ColumnsButton from "./_components/columns-button"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function HoldersManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("LibraryCardManagementPage")

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchPatronsSchema.parse(searchParams)

  const {
    sources: holders,
    totalActualItem,
    totalPage,
  } = await getPatrons({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Patrons")}</h3>
        <div className="flex items-center gap-4">
          <ColumnsButton />
          <Button asChild>
            <Link href="/management/library-card-holders/create">
              <Plus />
              {t("Create patron")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            {/* <BooksFilter isTrained={isTrained} f={f} o={o} v={v} /> */}
          </div>

          {/* <SelectedIdsIndicator /> */}
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          {/* <BooksActionsDropdown isTrained={isTrained} tab={tab} /> */}
          {/* <ImportDialog /> */}
          {/* <ExportButton
            searchParams={{
              search,
              pageIndex,
              sort,
              pageSize,
              tab,
              columns,
              f,
              o,
              v,
              ...rest,
            }}
          /> */}
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          {holders.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={totalPage}
          totalActualItem={totalActualItem}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default HoldersManagementPage
