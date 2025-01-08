"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CheckSquare, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type BookResource } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import ResourceBookTypeBadge from "@/components/ui/book-resource-type-badge"
import { Checkbox } from "@/components/ui/checkbox"
import FileSize from "@/components/ui/file-size"
import { Icons } from "@/components/ui/icons"
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

import CreateResourceDialog from "./create-resource-dialog"
import ResourcesActionsDropdown from "./resorces-actions-dropdown"
import ResourcesTabs from "./resources-tabs"

type Props = {
  resources: BookResource[]
  bookId: number
}

function ResourcesTabsContent({ resources, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
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
              "flex max-w-md flex-1 items-center rounded-lg border-2 px-2"
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
                    {t("Resource type")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Size")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Created at")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Created by")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
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
                    <TableCell className="text-nowrap">Sách nói</TableCell>
                    <TableCell>
                      <ResourceBookTypeBadge status={resource.resourceType} />
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <FileSize size={resource.resourceSize} />
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {format(new Date(resource.createdAt), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {resource.createdBy}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <Link
                        href={resource.resourceUrl}
                        target="_blank"
                        className="flex items-center text-primary"
                      >
                        <Icons.Open className="size-6" />
                        {t("Open")}
                      </Link>
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
