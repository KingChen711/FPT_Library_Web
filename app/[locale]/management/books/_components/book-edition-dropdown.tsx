"use client"

import Link from "next/link"
import { Eye, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { type BookEdition } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  bookEdition: BookEdition
  hideViewBookDetail?: boolean
}

function BookEditionActionDropdown({ bookEdition, hideViewBookDetail }: Props) {
  const t = useTranslations("BooksManagementPage")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          {!hideViewBookDetail && (
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/management/books/${bookEdition.bookId}`}>
                <Eye />
                {t("View book detail")}
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link
              href={`/management/books/${bookEdition.bookId}/editions/${bookEdition.bookEditionId}`}
            >
              <Eye />
              {t("View edition detail")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BookEditionActionDropdown
