"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import { formUrlQuery } from "@/lib/utils"
import {
  Column,
  defaultColumns,
} from "@/lib/validations/books/search-books-advance"
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
              {Object.values(Column).map((column) => (
                <Label
                  key={column}
                  className="flex cursor-pointer items-center gap-x-4 font-bold"
                >
                  <Checkbox
                    className="size-5"
                    checked={columns.includes(column)}
                    onCheckedChange={() => toggle(column)}
                  />
                  {t(column)}
                </Label>
              ))}

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
