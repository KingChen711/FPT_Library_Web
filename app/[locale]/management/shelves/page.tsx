import React from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import getShelves from "@/queries/shelves/get-shelves"
import { Eye, MoreHorizontal } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchShelvesSchema } from "@/lib/validations/shelves/get-shelves"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ShelfBadge from "@/components/badges/shelf-badge"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function ShelvesManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const t = await getTranslations("ShelvesManagementPage")

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchShelvesSchema.parse(searchParams)

  const locale = await getLocale()

  const {
    sources: shelves,
    totalActualItem,
    totalPage,
  } = await getShelves({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Shelves")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm className="h-10" search={search} />
          </div>
        </div>
      </div>

      {shelves.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Shelves Not Found")}
            description={t(
              "No shelves matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      ) : (
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex">{t("Shelf name")}</div>
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Classification number range")}
                    sortKey="ClassificationNumberRangeFrom"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Shelf number")}
                    sortKey="ShelfNumber"
                    position="center"
                  />
                  <TableHead className="text-nowrap font-bold">
                    {t("Section")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Zone")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center"> {t("Floor")}</div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shelves.map((shelf) => (
                  <TableRow key={shelf.libraryShelf.shelfId}>
                    <TableCell className="text-nowrap font-bold">
                      <div className="flex">
                        {locale === "vi"
                          ? shelf.libraryShelf.vieShelfName
                          : shelf.libraryShelf.engShelfName}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {Array(
                          Math.max(
                            3 -
                              shelf.libraryShelf.classificationNumberRangeFrom.toString()
                                .length,
                            0
                          )
                        )
                          .fill("0")
                          .join("") +
                          shelf.libraryShelf.classificationNumberRangeFrom}
                        -
                        {Array(
                          Math.max(
                            3 -
                              shelf.libraryShelf.classificationNumberRangeTo.toString()
                                .length,
                            0
                          )
                        )
                          .fill("0")
                          .join("") +
                          shelf.libraryShelf.classificationNumberRangeTo}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <ShelfBadge
                          shelfNumber={shelf.libraryShelf.shelfNumber}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex">
                        {locale === "vi"
                          ? shelf.section.vieSectionName
                          : shelf.section.engSectionName}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex">
                        {locale === "vi"
                          ? shelf.zone.vieZoneName
                          : shelf.zone.engZoneName}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {shelf.floor.floorNumber}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Link
                                href={`/management/shelves/${shelf.libraryShelf.shelfId}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="size-4" />
                                {t("View details")}
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Paginator
            pageSize={+pageSize}
            pageIndex={pageIndex}
            totalPage={totalPage}
            totalActualItem={totalActualItem}
            className="mt-6"
          />
        </div>
      )}
    </div>
  )
}

export default ShelvesManagementPage
