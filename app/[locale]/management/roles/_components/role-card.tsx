"use client"

import React, { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { ERoleType } from "@/lib/types/enums"
import { type Role } from "@/lib/types/models"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Skeleton } from "@/components/ui/skeleton"

import DeleteRoleDialog from "../../permissions/_components/delete-role-dialog"
import EditRoleDialog from "./edit-role-dialog"

type Props = {
  role: Role
  disabledContext?: boolean
  onClick?: () => void
  className?: string
}

function RoleCard({ role }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const t = useTranslations("RoleManagement")
  const locale = useLocale()

  return (
    <>
      <EditRoleDialog
        roleId={role.roleId}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteRoleDialog
        roleId={role.roleId}
        roleName={locale === "en" ? role.englishName : role.vietnameseName}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Card className="col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between gap-4">
                {locale === "vi" ? role.vietnameseName : role.englishName}
                <Badge
                  variant={
                    role.roleType === ERoleType.USER ? "info" : "progress"
                  }
                  className="flex w-[90px] shrink-0 justify-center"
                >
                  {t(role.roleType)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {role.roleType === ERoleType.USER
                  ? t("Standard user with basic permissions")
                  : t("Employee with extended access rights")}
              </p>
            </CardContent>
          </Card>
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

export default RoleCard

export const RoleCardSkeleton = () => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div className="col-span-12 h-full flex-1 rounded-md border bg-card p-4 shadow sm:col-span-6 lg:col-span-3">
        <div className="flex">
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem className="flex cursor-pointer items-center gap-x-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-12" />
      </ContextMenuItem>
      <ContextMenuItem className="flex cursor-pointer items-center gap-x-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-16" />
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
)
