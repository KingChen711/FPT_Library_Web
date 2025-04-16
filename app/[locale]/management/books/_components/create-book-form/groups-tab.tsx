import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { http } from "@/lib/http"
import { type Author, type LibraryItemGroup } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import GroupCard from "@/components/ui/group-card"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  show: boolean
  selectedAuthors: Author[]
}

const defaultGetGroupsRes: Pagination<LibraryItemGroup[]> = {
  pageIndex: 0,
  pageSize: 0,
  sources: [],
  totalActualItem: 0,
  totalPage: 0,
}

function GroupsTab({ form, isPending, selectedAuthors, show }: Props) {
  console.log()

  const t = useTranslations("BooksManagementPage")
  const { accessToken } = useAuth()

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"8" | "24" | "60" | "100">("8")

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "8" | "24" | "60" | "100") => {
    setPageSize(size)
  }

  const title = form.watch("title")
  const cutterNumber = form.watch("cutterNumber")
  const classificationNumber = form.watch("classificationNumber")
  const authorIds = form.watch("authorIds") || []
  const authorName = selectedAuthors
    .filter((a) => authorIds.includes(a.authorId))
    .map((a) => a.fullName)
    .join(",")

  const { data, isLoading } = useQuery({
    queryKey: [
      "potential-groups",
      { authorName, title, cutterNumber, classificationNumber },
      accessToken,
    ],
    queryFn: async (): Promise<Pagination<LibraryItemGroup[]>> => {
      if (!accessToken) return defaultGetGroupsRes

      try {
        const { data } = await http.get<
          Pagination<{ groupDetail: LibraryItemGroup }[]>
        >(`/api/management/library-items/groupable-items?`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            title,
            authorName,
            cutterNumber,
            classificationNumber,
          },
        })

        if (!data) return defaultGetGroupsRes

        return {
          ...data,
          sources: data.sources.map((s) => s.groupDetail),
        }
      } catch {
        return defaultGetGroupsRes
      }
    },
  })

  console.log(
    isPending,
    show,
    pageIndex,
    pageSize,
    handlePaginate,
    handleChangePageSize,
    isLoading
  )

  return (
    <FormField
      control={form.control}
      name="libraryItemInstances"
      render={({ field: _ }) => (
        <FormItem className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <FormLabel>{t("Group")}</FormLabel>
              <FormMessage />
            </div>
          </div>
          <div className="grid grid-cols-12 items-center gap-4">
            {data?.sources.map((group) => (
              <GroupCard
                className="col-span-12 md:col-span-6 lg:col-span-3"
                key={group.groupId}
                group={group}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  )
}

export default GroupsTab
