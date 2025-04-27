"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MoreHorizontal, Navigation } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  type Author,
  type BookEdition,
  type BorrowRecordDetail,
  type Category,
  type Condition,
  type Employee,
  type Fine,
  type FineBorrow,
  type LibraryItemInstance,
  type Shelf,
} from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import BorrowRecordFineDialog from "./borrow-record-fine-dialog"

type Props = {
  detail: BorrowRecordDetail & {
    libraryItem: BookEdition & {
      shelf: Shelf | null
      category: Category
      authors: Author[]
      libraryItemInstances: LibraryItemInstance[]
    }
    condition: Condition
    returnCondition: Condition | null
    fines: (FineBorrow & { finePolicy: Fine; createByNavigation: Employee })[]
  }
}

function BorrowRecordActionDropdown({ detail }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [openFine, setOpenFine] = useState(false)

  return (
    <>
      <BorrowRecordFineDialog
        borrowRecordId={detail.borrowRecordId}
        fines={detail.fines.map((f) => ({
          ...f,
          itemName: detail.libraryItem.title,
          image: detail.libraryItem.coverImage,
        }))}
        open={openFine}
        setOpen={setOpenFine}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 w-full justify-center p-0"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              target="_blank"
              href={`/books/${detail.libraryItem.libraryItemId}`}
              className="flex items-center gap-2"
            >
              <Navigation className="size-4" />
              {t("View library item")}
            </Link>
          </DropdownMenuItem>
          {detail.fines.length > 0 && (
            <DropdownMenuItem
              onClick={() => setOpenFine(true)}
              className="cursor-pointer"
            >
              <Eye className="size-4" />
              {t("View fines")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BorrowRecordActionDropdown
