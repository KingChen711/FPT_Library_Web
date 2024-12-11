"use client"

import React from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import DeleteRoleDialog from "./delete-role-dialog"
import EditRoleDialog from "./edit-role-dialog"

type Props = {
  roleId: number
  roleName: string
}

function RoleActionContextMenu({ roleId, roleName }: Props) {
  const t = useTranslations("RoleManagement")
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)

  return (
    <>
      <EditRoleDialog
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        roleId={roleId}
      />
      <DeleteRoleDialog
        roleId={roleId}
        roleName={roleName}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="min-w-[180px]">
            <Button
              variant="ghost"
              className="w-fit gap-x-2 font-bold text-primary hover:text-primary"
            >
              {roleName}
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <PencilIcon className="size-4" />
            {t("Edit")}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <Trash2Icon className="size-4" />
            {t("Delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default RoleActionContextMenu
