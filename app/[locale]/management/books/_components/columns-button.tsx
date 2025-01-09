"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import { formUrlQuery } from "@/lib/utils"
import {
  Column,
  defaultColumns,
} from "@/lib/validations/books/search-book-editions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Props = {
  columns: Column[]
}

function ColumnsButton({ columns: initColumns }: Props) {
  const t = useTranslations("BooksManagementPage")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [columns, setColumns] = useState(initColumns)
  const [open, setOpen] = useState(false)

  const handleResetDefault = () => {
    setColumns(defaultColumns)
  }

  const handleApply = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        columns: columns.map((c) => c.toString()),
      },
    })

    router.replace(newUrl, { scroll: false })
    setOpen(false)
  }

  const toggle = (column: Column) => {
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye />
          {t("Columns")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-full max-w-sm overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("show hide columns")}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-4">
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.BOOK_CODE)}
                  onCheckedChange={() => toggle(Column.BOOK_CODE)}
                />
                {t("Book code")}
              </Label>

              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.COVER_IMAGE)}
                  onCheckedChange={() => toggle(Column.COVER_IMAGE)}
                />
                {t("Cover")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.TITLE)}
                  onCheckedChange={() => toggle(Column.TITLE)}
                />
                {t("Title")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.EDITION_TITLE)}
                  onCheckedChange={() => toggle(Column.EDITION_TITLE)}
                />
                {t("Edition title")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.EDITION_NUMBER)}
                  onCheckedChange={() => toggle(Column.EDITION_NUMBER)}
                />
                {t("Edition number")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.PUBLICATION_YEAR)}
                  onCheckedChange={() => toggle(Column.PUBLICATION_YEAR)}
                />
                {t("Publication year")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.ISBN)}
                  onCheckedChange={() => toggle(Column.ISBN)}
                />
                ISBN
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.AUTHOR)}
                  onCheckedChange={() => toggle(Column.AUTHOR)}
                />
                {t("Authors")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.LANGUAGE)}
                  onCheckedChange={() => toggle(Column.LANGUAGE)}
                />
                {t("Language")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.CATEGORIES)}
                  onCheckedChange={() => toggle(Column.CATEGORIES)}
                />
                {t("Categories")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.PUBLISHER)}
                  onCheckedChange={() => toggle(Column.PUBLISHER)}
                />
                {t("Publishers")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.PAGE_COUNT)}
                  onCheckedChange={() => toggle(Column.PAGE_COUNT)}
                />
                {t("Page count")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.SHELF)}
                  onCheckedChange={() => toggle(Column.SHELF)}
                />
                {t("Shelf")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.FORMAT)}
                  onCheckedChange={() => toggle(Column.FORMAT)}
                />
                {t("Format")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.STATUS)}
                  onCheckedChange={() => toggle(Column.STATUS)}
                />
                {t("Status")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.CAN_BORROW)}
                  onCheckedChange={() => toggle(Column.CAN_BORROW)}
                />
                {t("Can borrow")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.TOTAL_COPIES)}
                  onCheckedChange={() => toggle(Column.TOTAL_COPIES)}
                />
                {t("Total copies")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.AVAILABLE_COPIES)}
                  onCheckedChange={() => toggle(Column.AVAILABLE_COPIES)}
                />
                {t("Available copies")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.BORROWED_COPIES)}
                  onCheckedChange={() => toggle(Column.BORROWED_COPIES)}
                />
                {t("Borrowed copies")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.REQUEST_COPIES)}
                  onCheckedChange={() => toggle(Column.REQUEST_COPIES)}
                />
                {t("Request copies")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.RESERVED_COPIES)}
                  onCheckedChange={() => toggle(Column.RESERVED_COPIES)}
                />
                {t("Reserved copies")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.CREATED_BY)}
                  onCheckedChange={() => toggle(Column.CREATED_BY)}
                />
                {t("Created by")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.CREATED_AT)}
                  onCheckedChange={() => toggle(Column.CREATED_AT)}
                />
                {t("Created at")}
              </Label>
              <Label className="flex cursor-pointer items-center gap-x-4 font-bold">
                <Checkbox
                  className="size-5"
                  checked={columns.includes(Column.UPDATED_AT)}
                  onCheckedChange={() => toggle(Column.UPDATED_AT)}
                />
                {t("Updated at")}
              </Label>

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleResetDefault}
                  className="w-full"
                  variant="outline"
                >
                  {t("Reset default")}
                </Button>
                <Button onClick={handleApply} className="w-full">
                  {t("Apply")}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ColumnsButton
