"use client"

import React from "react"
import { HistoryIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

// import PermissionHistoryDialog from "./history-permission-dialog"

type Props = {
  roleId: number
  // rolePermissionId: number
  roleName: string
}

function RoleActionContextMenu({ roleName }: Props) {
  const t = useTranslations("RoleManagement")
  // const [openDelete, setOpenDelete] = React.useState(false)
  // const [openEdit, setOpenEdit] = React.useState(false)
  // const [openHistory, setOpenHistory] = React.useState(false)

  return (
    <>
      {/* <EditRoleDialog
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        roleId={roleId}
      />
      <DeleteRoleDialog
        roleId={roleId}
        roleName={roleName}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      /> */}
      {/* <PermissionHistoryDialog
        open={openHistory}
        setOpen={setOpenHistory}
        rolePermissionId={rolePermissionId}
      /> */}
      <ContextMenu>
        <ContextMenuTrigger asChild disabled>
          <div className="min-w-[180px] cursor-default">
            <Button
              variant="ghost"
              className="w-fit cursor-default gap-x-2 font-bold text-primary hover:text-primary"
            >
              {roleName}
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {/* <ContextMenuItem
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
          </ContextMenuItem> */}
          <ContextMenuItem
            // onSelect={() => setOpenHistory(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <HistoryIcon className="size-4" />
            {t("Changes history")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default RoleActionContextMenu
