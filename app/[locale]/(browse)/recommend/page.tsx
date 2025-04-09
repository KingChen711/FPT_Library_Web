import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getRecommendBooks from "@/queries/books/get-recommend-books"
import { BookOpen, CheckCircle2, ChevronDown, Headphones } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { searchRecommendSchema } from "@/lib/validations/books/search-recommend-schema"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import FilterRecommendBooks from "./_componenets/filter-recommend-books"

type Props = {
  searchParams: Record<string, string>
}

async function RecommendPage({ searchParams }: Props) {
  await auth().protect()

  const { pageIndex, pageSize, ...rest } = searchRecommendSchema.parse({
    ...searchParams,
    pageSize: searchParams?.pageSize || "5",
  })

  const {
    sources: books,
    totalActualItem,
    totalPage,
  } = await getRecommendBooks({
    pageIndex,
    pageSize,
    ...rest,
  })

  console.log({ books: books.length })

  const t = await getTranslations("BookPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Recommend for you")}</h3>
        <FilterRecommendBooks />
      </div>

      <div className="mt-4">
        {books.length === 0 ? (
          <div className="flex justify-center p-4">
            <NoResult
              title={t("Library Items Not Found")}
              description={t(
                "No library items matching your request were found Please check your information or try searching with different criteria"
              )}
            />
          </div>
        ) : (
          <section className="space-y-4">
            {books.map((item, i) => (
              <div key={i} className="rounded-md border-2 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Sách</p>
                  <Button asChild variant={"link"}>
                    <Link
                      href={`/books/${item.libraryItemId}`}
                      className="flex items-center gap-2"
                    >
                      View Detail
                    </Link>
                  </Button>
                </div>
                <Separator className="my-2" />

                <div className="flex gap-4">
                  <div className="flex w-1/8 justify-center">
                    <Image
                      src={item.coverImage || ""}
                      width={100}
                      height={100}
                      alt="book"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-thin italic">
                      {t("an edition of")} &nbsp;
                      <span className="font-semibold">{item.title}</span>
                    </p>
                    <h1 className="text-xl font-semibold text-primary">
                      {item.title}: Tài liệu giảng dạy /
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Tác giả</span>
                      {item.authors.length > 0 && item.authors[0].fullName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Chủ đề </span>{" "}
                      {item.topicalTerms}
                    </div>
                    <div className="flex gap-2">
                      <div className="w-fit font-semibold">Summary</div>
                      <span className="line-clamp-1">{item.summary}</span>
                    </div>
                  </div>
                </div>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Số kệ</TableHead>
                      <TableHead>Kí hiệu xếp giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                        Available
                      </TableCell>
                      <TableCell>AGU-Institutional Resources - F3</TableCell>
                      <TableCell>909 G106 2024</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="mt-4 flex items-center gap-2">
                      Resources <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Headphones /> Audio
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookOpen />
                      Ebook
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <Paginator
              pageSize={+pageSize}
              pageIndex={pageIndex}
              totalPage={totalPage}
              totalActualItem={totalActualItem}
              scrollOnPaginate
              className="mt-6"
            />
          </section>
        )}
      </div>
    </div>
  )
}

export default RecommendPage
