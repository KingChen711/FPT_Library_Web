"use client"

import React, { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import DeleteCategoryDialog from "../../app/[locale]/management/categories/_components/delete-category-dialog"
import MutateCategoryDialog from "../../app/[locale]/management/categories/_components/mutate-category-dialog"
import { Skeleton } from "./skeleton"

type Props = {
  category: Category
  disabledContext?: boolean
  onClick?: () => void
  className?: string
}

function CategoryCard({
  category,
  disabledContext = false,
  onClick,
  className,
}: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const t = useTranslations("CategoriesManagementPage")
  const locale = useLocale()

  return (
    <>
      <MutateCategoryDialog
        type="update"
        category={category}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteCategoryDialog
        categoryId={category.categoryId}
        categoryName={
          locale === "en" ? category.englishName : category.vietnameseName
        }
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger disabled={disabledContext} asChild>
          <div
            className={cn(
              "col-span-12 h-full flex-1 rounded-md border bg-card p-4 shadow sm:col-span-6 lg:col-span-3",
              className
            )}
            onClick={() => {
              if (onClick) {
                onClick()
              }
            }}
          >
            {/* <div className="flex">
              <div className="text-sm">
                Id: <strong>{category.categoryId}</strong>
              </div>
            </div> */}

            <div className="line-clamp-2 text-sm font-medium text-muted-foreground">
              {t("Prefix")}:{" "}
              <span className="text-foreground">{category.prefix}</span>
            </div>
            <div className="line-clamp-2 font-bold">
              {locale === "en" ? category.englishName : category.vietnameseName}
            </div>
            <p className="line-clamp-4 text-sm text-muted-foreground">
              {category.description}
            </p>
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

export default CategoryCard

export const CategoryCardSkeleton = () => (
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
