"use client"

import { type Dispatch, type SetStateAction } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePathname } from "@/i18n/routing"
import { type TGetAuthorsData } from "@/queries/authors/get-authors"
import { ArrowDownUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { type Author } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { AuthorFilter } from "@/lib/validations/author/author-filter"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AuthorAction from "./author-action"
import AuthorPagination from "./author-pagination"
import AuthorRowPage from "./author-row-page"

type AuthorTableProps = {
  tableData: TGetAuthorsData
  selectedIds: string[]
  setSelectedIds: Dispatch<SetStateAction<string[]>>
}

const AuthorTable = ({
  tableData,
  selectedIds,
  setSelectedIds,
}: AuthorTableProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()

  const handleSortParams = (key: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSort = params.get("sort")

    const newSort =
      currentSort === `-${key}` ? key : currentSort === key ? `-${key}` : key

    params.set("sort", newSort)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const isAllSelected =
    tableData.sources.length > 0 &&
    selectedIds.length === tableData.sources.length

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(
        tableData.sources.map((author) => author.authorId.toString())
      )
    }
  }

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    )
  }

  if (tableData.sources.length === 0) {
    return (
      <div className="p-4 text-center text-xl font-semibold text-destructive">
        {t("no data")}
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <Table className="border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>No</TableHead>
                <TableHead
                  className="flex items-center gap-x-2 text-nowrap"
                  onClick={() => handleSortParams(AuthorFilter.AUTHOR_CODE)}
                >
                  {t("fields.authorCode")}
                  <ArrowDownUp size={16} className="cursor-pointer" />
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.FULL_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.fullName")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.BIOGRAPHY)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.biography")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(AuthorFilter.DOB)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.dob")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.DATE_OF_DEATH)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.date of death")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.NATIONALITY)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.nationality")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.CREATE_DATE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.createDate")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(AuthorFilter.UPDATE_DATE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.updateDate")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>

                <TableHead className="text-nowrap"> {t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl">
              {tableData.sources.map((author: Author, index: number) => (
                <TableRow key={author.authorId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(author.authorId.toString())}
                      onCheckedChange={() =>
                        toggleRow(author.authorId.toString())
                      }
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{author.authorCode}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 pr-8">
                      <Image
                        src={"https://github.com/shadcn.png"}
                        alt="avatar"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <p className="text-nowrap">{author.fullName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{author.biography}</TableCell>
                  <TableCell>{formatDate(author.dob)}</TableCell>
                  <TableCell>{author.nationality}</TableCell>
                  <TableCell>{formatDate(author.createDate)}</TableCell>
                  <TableCell>{formatDate(author.updateDate)}</TableCell>
                  <TableCell>{formatDate(author.dateOfDeath)}</TableCell>

                  <TableCell>
                    <AuthorAction author={author} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-end p-4">
        <div className="flex w-2/3 items-center justify-between">
          <AuthorPagination totalPages={tableData.totalPage} />
          <AuthorRowPage />
        </div>
      </div>
    </div>
  )
}

export default AuthorTable
