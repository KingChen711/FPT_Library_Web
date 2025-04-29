"use client"

import { useState } from "react"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { EFineType } from "@/lib/types/enums"
import { type Fine } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteFineDialog from "./delete-fine-dialog"
import MutateFineDialog from "./mutate-fine-dialog"

type Props = {
  fine: Fine
}

function FineActionDropdown({ fine }: Props) {
  const t = useTranslations("FinesManagementPage")
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      <MutateFineDialog
        type="update"
        fine={fine}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteFineDialog
        fineId={fine.finePolicyId}
        fineName={fine.description || ""}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <DropdownMenuItem className="cursor-pointer">
            <div
              onClick={() => setOpenEdit(true)}
              className="flex items-center gap-x-2"
            >
              <PencilIcon className="size-4" />
              {t("Edit")}
            </div>
          </DropdownMenuItem>

          {fine.conditionType === EFineType.DAMAGE && (
            <DropdownMenuItem className="cursor-pointer" asChild>
              <div
                onClick={() => setOpenDelete(true)}
                className="flex cursor-pointer items-center gap-x-2 rounded-sm px-2 py-[6px] text-sm leading-5 hover:bg-muted"
              >
                <Trash2Icon className="size-4" />
                {t("Delete")}
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default FineActionDropdown
