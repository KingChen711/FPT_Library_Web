"use client"

import React, { useState } from "react"
import { Brain, Hash, PencilIcon, Trash2Icon } from "lucide-react"
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
import { Badge } from "./badge"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Icons } from "./icons"
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
          <Card
            onClick={() => {
              if (onClick) onClick()
            }}
            className={cn(
              "col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-4 xl:col-span-3",
              className
            )}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="line-clamp-2 flex items-center">
                  <Icons.Category className="mr-2 size-5" />
                  {locale === "en"
                    ? category.englishName
                    : category.vietnameseName}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Hash className="mr-2 size-4 text-muted-foreground" />
                  <span className="font-medium">{t("Prefix")}:</span>
                  <span className="ml-2 font-bold">{category.prefix}</span>
                </div>

                <div className="flex items-center">
                  <Icons.BorrowBook className="mr-2 size-4 text-muted-foreground" />
                  <span className="font-medium">{t("Total borrow days")}:</span>
                  <span className="ml-2 font-bold">
                    {category.totalBorrowDays}
                  </span>
                </div>

                <div className="flex items-center">
                  <Brain className="mr-2 size-4 text-muted-foreground" />
                  <span className="font-medium">AI Training:</span>
                  <Badge
                    variant={category.isAllowAITraining ? "success" : "danger"}
                    className="ml-2 shrink-0 rounded-md"
                  >
                    {category.isAllowAITraining
                      ? t("Allowed")
                      : t("Not allowed")}
                  </Badge>
                </div>

                <p>{category.description}</p>
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
      <div className="col-span-12 h-full flex-1 rounded-md border bg-card p-4 shadow sm:col-span-6 lg:col-span-4 xl:col-span-3">
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
