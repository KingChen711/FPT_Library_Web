"use client"

import React, { useState } from "react"
import { type ShelfDetail } from "@/queries/shelves/get-shelf"
import { ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EditShelfDialog from "./edit-shelf-dialog"

type Props = {
  shelfDetail: ShelfDetail
}

function ShelfActionsDropdown({ shelfDetail }: Props) {
  const t = useTranslations("LibraryCardManagementPage")

  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <>
      <EditShelfDialog
        setOpen={setOpenEdit}
        open={openEdit}
        shelf={shelfDetail}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ShelfActionsDropdown
