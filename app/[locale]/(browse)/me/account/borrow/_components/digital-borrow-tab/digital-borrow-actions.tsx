"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react"

import { EResourceBookType } from "@/lib/types/enums"
import { type BorrowItem } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DigitalBorrowExtendConfirm from "./digital-borrow-extend-confirm"

type Props = {
  resourceId: number
  borrowItem: BorrowItem
}

const DigitalBorrowActions = ({ resourceId, borrowItem }: Props) => {
  const router = useRouter()
  const [openExtendConfirm, setOpenExtendConfirm] = useState(false)
  const handleViewResource = () => {
    if (
      borrowItem.libraryResource.resourceType === EResourceBookType.AUDIO_BOOK
    ) {
      router.push(
        `/books/resources/${resourceId}?resourceType=${EResourceBookType.AUDIO_BOOK}`
      )
    }
    if (borrowItem.libraryResource.resourceType === EResourceBookType.EBOOK) {
      router.push(
        `/books/resources/${resourceId}?resourceType=${EResourceBookType.EBOOK}`
      )
    }
  }

  const handleViewDetail = () => {
    router.push(`/me/account/borrow/digital/${borrowItem.digitalBorrowId}`)
  }

  return (
    <>
      <DigitalBorrowExtendConfirm
        resourceId={resourceId}
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
            <Eye /> View detail
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleViewResource}
          >
            <Eye /> View resource
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenExtendConfirm(true)}
          >
            <RotateCcw /> Extend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DigitalBorrowActions
