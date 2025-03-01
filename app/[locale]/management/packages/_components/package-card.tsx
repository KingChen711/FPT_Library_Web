"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { type LibraryPackage } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Icons } from "@/components/ui/icons"

import DeletePackageDialog from "./delete-package-dialog"
import MutatePackageDialog from "./mutate-package-dialog"

type Props = {
  item: LibraryPackage
  disabledContext?: boolean
  onClick?: () => void
  className?: string
}

const PackageCard = ({
  item,
  disabledContext = false,
  onClick,
  className,
}: Props) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const t = useTranslations("GeneralManagement")

  return (
    <>
      <MutatePackageDialog
        type="update"
        libraryPackage={item}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeletePackageDialog
        libraryPackageId={item.libraryCardPackageId}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger disabled={disabledContext} asChild>
          <Card
            onClick={() => {
              if (onClick) onClick()
            }}
            className={cn(
              "col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-3",
              className
            )}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="line-clamp-2 flex items-center">
                  <Icons.Package className="mr-2 size-5" />
                  {item.packageName}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="space-x-2 text-base font-medium">
                  💰 {t("price")}:
                  <span className="ml-2 text-yellow-500">
                    ${item.price.toLocaleString()}
                  </span>
                </p>
                <p className="text-base">
                  📅 {t("duration")}: {item.durationInMonths} {t("month")}
                </p>
                <Badge
                  variant={item.isActive ? "success" : "destructive"}
                  className="flex w-fit items-center justify-center text-center"
                >
                  {item.isActive ? t("fields.active") : t("fields.inactive")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <PencilIcon className="size-4" />
            {t("edit")}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <Trash2Icon className="size-4" />
            {t("delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default PackageCard
