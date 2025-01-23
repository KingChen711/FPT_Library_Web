"use client"

import React, { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Category } from "@/lib/types/models"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import DeleteCategoryDialog from "./delete-category-dialog"
import MutateCategoryDialog from "./mutate-category-dialog"

type Props = {
  category: Category
}

function CategoryCard({ category }: Props) {
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
        <ContextMenuTrigger asChild>
          <div className="col-span-12 h-full flex-1 rounded-md border bg-card p-4 shadow sm:col-span-6 lg:col-span-3">
            <div className="flex">
              <div className="text-sm">
                Id: <strong>{category.categoryId}</strong>
              </div>
            </div>

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
