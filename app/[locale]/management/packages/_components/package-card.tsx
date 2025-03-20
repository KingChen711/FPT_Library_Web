"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Package } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import DeletePackageDialog from "./delete-package-dialog"
import MutatePackageDialog from "./mutate-package-dialog"

type Props = {
  item: Package
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
  const locale = useLocale()

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const t = useTranslations("GeneralManagement")
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(item.price)

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
              "col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-4",
              onClick && "cursor-pointer",
              className
            )}
          >
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  {item.packageName}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="text-nowrap bg-primary/10 text-primary"
                >
                  {item.durationInMonths} {locale === "vi" ? "tháng" : "months"}
                </Badge>
              </div>
              <CardDescription className="text-2xl font-bold text-primary">
                {formattedPrice}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
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
