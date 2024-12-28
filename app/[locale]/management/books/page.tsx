import React from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import { useManagementBooksStore } from "@/stores/books/use-management-books"
import { Plus } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchBooksSchema } from "@/lib/validations/books/search-books"
import { Button } from "@/components/ui/button"
import SearchForm from "@/components/ui/search-form"

import SelectedIdsIndicator from "./_components/selected-ids-indicator"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

async function BooksManagementPage({ searchParams }: Props) {
  console.log(searchParams)

  const { search, pageIndex, sort, pageSize } =
    searchBooksSchema.parse(searchParams)
  await auth().protect(EFeature.BOOK_MANAGEMENT)
  const t = await getTranslations("BooksManagementPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Books")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              //   className="h-full rounded-r-none border-r-0"
              search={search}
            />
            {/* <FiltersBooksDialog /> */}
          </div>

          <SelectedIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          {/* <DeleteBooksButton /> */}
          <Button asChild>
            <Link href="/management/books/create">
              <Plus />
              {t("Create book")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          {/* <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <TableHead></TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label="Id"
                  sortKey="BookPolicyId"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Condition type")}
                  sortKey="ConditionType"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Fixed book amount")}
                  sortKey="BookAmountPerDay"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Book amount per day")}
                  sortKey="FixedBookAmount"
                />
                <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.bookPolicyId}>
                  <TableCell className="">
                    <BookCheckbox id={book.bookPolicyId} />
                  </TableCell>
                  <TableCell className="font-extrabold">
                    {book.bookPolicyId}
                  </TableCell>
                  <TableCell>{book.conditionType}</TableCell>
                  <TableCell>{formatPrice(book.fixedBookAmount)}</TableCell>
                  <TableCell>{formatPrice(book.bookAmountPerDay)}</TableCell>
                  <TableCell className="flex justify-center">
                    <BookActionDropdown book={book} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
        </div>

        {/* <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={100}
          className="mt-6"
        /> */}
      </div>
    </div>
  )
}

export default BooksManagementPage
