"use client"

import React, { useState, useTransition } from "react"
import defaultAuthor from "@/public/assets/images/default-author.jpg"
import { format } from "date-fns"
import { CheckSquare, Loader2, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { removeAuthors } from "@/actions/books/editions/remove-authors"
import { toast } from "@/hooks/use-toast"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import ImageWithFallback from "@/components/ui/image-with-fallback"
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

import AddAuthorsDialog from "./add-authors-dialog"

type Props = {
  authors: Author[]
  bookId: number
}

function AuthorsTabsContent({ authors, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const formatLocale = useFormatLocale()

  const locale = useLocale()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()

  const handleRemoveAuthors = () => {
    startTransition(async () => {
      const res = await removeAuthors({
        authorIds: selectedIds,
        bookId,
      })
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedIds([])
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <TabsContent value="authors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {selectedIds.length > 0 && (
            <div className="flex h-9 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
              <CheckSquare className="size-4" />
              {t("authors selected", {
                amount: selectedIds.length.toString(),
              })}
              <X
                className="size-4 cursor-pointer"
                onClick={() => setSelectedIds([])}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {selectedIds.length > 0 && (
            <Button
              disabled={isPending}
              onClick={handleRemoveAuthors}
              variant="destructive"
            >
              <Trash2 />
              {t("Delete")}
              {isPending && <Loader2 className="size-4 animate-spin" />}
            </Button>
          )}
          <AddAuthorsDialog
            currentIds={authors.map((a) => a.authorId)}
            bookId={bookId}
          />
        </div>
      </div>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Author code")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Full name")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Date of birth")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Date of death")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Nationality")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex justify-center p-4">
                      <NoData />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {authors.map((author) => (
                <TableRow key={author.authorId}>
                  <TableCell className="text-nowrap font-bold">
                    <Checkbox
                      disabled={isPending}
                      checked={selectedIds.includes(author.authorId)}
                      onCheckedChange={() => {
                        if (selectedIds.includes(author.authorId)) {
                          setSelectedIds((prev) =>
                            prev.filter((a) => a !== author.authorId)
                          )
                        } else {
                          setSelectedIds((prev) => [...prev, author.authorId])
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {author.authorCode}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex items-center">
                      <ImageWithFallback
                        src={author.authorImage || defaultAuthor}
                        alt={author.fullName}
                        width={36}
                        height={36}
                        fallbackSrc={defaultAuthor}
                        className="size-9 shrink-0 rounded-full"
                      />
                      <p className="ml-2">{author.fullName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex items-center justify-center">
                      {author.dob
                        ? format(new Date(author.dob), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex items-center justify-center">
                      {author.dateOfDeath
                        ? format(new Date(author.dateOfDeath), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {author.nationality || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TabsContent>
  )
}

export default AuthorsTabsContent
