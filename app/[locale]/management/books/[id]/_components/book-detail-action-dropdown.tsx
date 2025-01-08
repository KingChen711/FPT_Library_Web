"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type Book, type Category } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteBookDialog from "./delete-book-dialog"
import EditBookDialog from "./edit-book-dialog"

type Props = {
  book: Book & { categories: Category[] }
}

function BookDetailActionDropdown({ book }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  return (
    <>
      <EditBookDialog open={openEdit} setOpen={setOpenEdit} book={book} />

      <DeleteBookDialog
        title={book.title}
        open={openDelete}
        setOpen={setOpenDelete}
        bookId={book.bookId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenEdit(true)
            }}
          >
            <Pencil />
            {t("Edit information")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenDelete(true)
            }}
          >
            <Trash2 /> {t("Delete book")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BookDetailActionDropdown
