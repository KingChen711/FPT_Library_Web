"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"

import { EBorrowDigitalStatus, EResourceBookType } from "@/lib/types/enums"
import {
  type BookResource,
  type BorrowDigital,
  type LibraryCard,
} from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DigitalBorrowExtendConfirm from "./digital-borrow-extend-confirm"

type Props = {
  borrowItem: BorrowDigital & {
    libraryResource: BookResource
    librarycard: LibraryCard
  }
}

const DigitalBorrowActions = ({ borrowItem }: Props) => {
  const router = useRouter()
  const [openExtendConfirm, setOpenExtendConfirm] = useState(false)
  const t = useTranslations("BookPage.borrow tracking")
  const handleViewResource = () => {
    if (
      borrowItem.libraryResource.resourceType === EResourceBookType.AUDIO_BOOK
    ) {
      router.push(
        `/books/resources/${borrowItem.resourceId}?resourceType=${EResourceBookType.AUDIO_BOOK}`
      )
    }
    if (borrowItem.libraryResource.resourceType === EResourceBookType.EBOOK) {
      router.push(
        `/books/resources/${borrowItem.resourceId}?resourceType=${EResourceBookType.EBOOK}`
      )
    }
  }

  const handleViewDetail = () => {
    router.push(`/me/account/borrow/digital/${borrowItem.digitalBorrowId}`)
  }

  return (
    <>
      <DigitalBorrowExtendConfirm
        resourceId={borrowItem.resourceId}
        open={openExtendConfirm}
        setOpen={setOpenExtendConfirm}
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleViewDetail}
          >
            <Eye /> {t("view detail")}
          </DropdownMenuItem>
          {borrowItem.status === EBorrowDigitalStatus.ACTIVE && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleViewResource}
            >
              <Eye /> {t("view resource")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenExtendConfirm(true)}
          >
            <RotateCcw /> {t("extend")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DigitalBorrowActions
