"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { CheckSquare, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type BookResource } from "@/lib/types/models"
import { cn, formatPrice } from "@/lib/utils"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Checkbox } from "@/components/ui/checkbox"
import FileSize from "@/components/ui/file-size"
import { Input } from "@/components/ui/input"
import NoData from "@/components/ui/no-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"

import CreateResourceDialog from "./create-resource-dialog"
import ResourceActionsDropdown from "./resource-actions-dropdown"
import ResourcesActionsDropdown from "./resources-actions-dropdown"
import ResourcesTabs from "./resources-tabs"

type Props = {
  resources: BookResource[]
  bookId: number
}

function ResourcesTabsContent({ resources, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const formatLocale = useFormatLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([])
  const [tab, setTab] = useState<"Active" | "Deleted">("Active")

  const filteredResources = resources.filter(
    (resource) => resource.isDeleted === (tab === "Deleted")
  )

  useEffect(() => {
    setSelectedResourceIds([])
  }, [tab])

  return (
    <TabsContent value="resources">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex max-w-md flex-1 items-center rounded-md border-2 px-2"
            )}
          >
            <Search className="size-6" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
            />
          </div>
          {selectedResourceIds.length > 0 && (
            <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
              <CheckSquare className="size-4" />
              {t("resources selected", {
                amount: selectedResourceIds.length.toString(),
              })}
              <X
                className="size-4 cursor-pointer"
                onClick={() => setSelectedResourceIds([])}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {selectedResourceIds.length > 0 && (
            <ResourcesActionsDropdown
              bookId={bookId}
              selectedResourceIds={selectedResourceIds}
              setSelectedResourceIds={setSelectedResourceIds}
              tab={tab}
            />
          )}
          <CreateResourceDialog bookId={bookId} />
        </div>
      </div>

      <div className="mt-4 rounded-md border p-4">
        <ResourcesTabs setTab={setTab} tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Title")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Resource type")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Size")}</div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow price header")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow duration")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Created at")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Created by")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Updated at")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Updated by")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11}>
                      <div className="flex justify-center p-4">
                        <NoData />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {filteredResources.map((resource) => (
                  <TableRow key={resource.resourceId}>
                    <TableCell className="font-extrabold">
                      <Checkbox
                        checked={selectedResourceIds.includes(
                          resource.resourceId
                        )}
                        onCheckedChange={() => {
                          if (
                            selectedResourceIds.includes(resource.resourceId)
                          ) {
                            setSelectedResourceIds((prev) =>
                              prev.filter((id) => id !== resource.resourceId)
                            )
                          } else {
                            setSelectedResourceIds((prev) => [
                              ...prev,
                              resource.resourceId,
                            ])
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.resourceTitle}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <ResourceBookTypeBadge status={resource.resourceType} />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <FileSize size={resource.resourceSize} />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {resource.borrowPrice
                          ? formatPrice(resource.borrowPrice)
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {resource.defaultBorrowDurationDays
                          ? resource.defaultBorrowDurationDays + " " + t("days")
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.createdAt
                        ? format(new Date(resource.createdAt), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.createdBy}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.updatedAt
                        ? format(new Date(resource.updatedAt), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.updatedBy}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <ResourceActionsDropdown
                        bookId={bookId}
                        resource={resource}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

export default ResourcesTabsContent
