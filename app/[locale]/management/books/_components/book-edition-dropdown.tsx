"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Book,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  MoreHorizontalIcon,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { type BookEdition } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [showInventory, setShowInventory] = useState(false)

  const combinedBookEdition = {
    ...bookEdition,
    ...bookEdition.bookEditionInventory,
  }

  return (
    <>
      <Dialog open={showInventory} onOpenChange={setShowInventory}>
        <DialogContent className="max-h-[90vh] w-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Inventory copies")}</DialogTitle>
            <DialogDescription asChild>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Book className="size-4" />
                  <span className="text-sm font-medium">
                    {t("Total copies")}:
                  </span>
                </div>
                <div className="text-sm">{combinedBookEdition.totalCopies}</div>

                <div className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  <span className="text-sm font-medium">
                    {t("Available copies")}:
                  </span>
                </div>
                <div className="text-sm">
                  {combinedBookEdition.availableCopies}
                </div>

                <div className="flex items-center gap-2">
                  <Users className="size-4" />
                  <span className="text-sm font-medium">
                    {t("Borrowed copies")}:
                  </span>
                </div>
                <div className="text-sm">
                  {combinedBookEdition.borrowedCopies}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span className="text-sm font-medium">
                    {t("Requested copies")}:
                  </span>
                </div>
                <div className="text-sm">
                  {combinedBookEdition.requestCopies}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span className="text-sm font-medium">
                    {t("Reserved copies")}:
                  </span>
                </div>
                <div className="text-sm">
                  {combinedBookEdition.reservedCopies}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <DropdownMenuItem
            onClick={() => setShowInventory(true)}
            className="cursor-pointer"
          >
            <Eye />
            {t("View inventory")}
          </DropdownMenuItem>

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
