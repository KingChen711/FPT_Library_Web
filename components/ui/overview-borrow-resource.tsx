"use client"

import { useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { localStorageHandler } from "@/lib/utils"
import useResourceDetail from "@/hooks/library-items/use-resource-detail"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { Badge } from "./badge"
import NoData from "./no-data"

type Props = {
  resourceId: string
}

const OverviewBorrowResource = ({ resourceId }: Props) => {
  const t = useTranslations("BookPage")
  const { data: resource, isLoading } = useResourceDetail(resourceId)
  const [openDelete, setOpenDelete] = useState(false)

  const handleRemoveBorrow = () => {
    localStorageHandler.setItem(
      LocalStorageKeys.BORROW_RESOURCE_IDS,
      resourceId
    )
    setOpenDelete(false)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <Skeleton className="h-24 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      </Card>
    )
  }

  if (!resource) {
    return <NoData />
  }

  return (
    <>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("remove from borrow list")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("are you sure you want to remove")}
              <span className="mx-2 font-semibold">
                &quot;{resource.resourceTitle}&quot;
              </span>
              {t("from your favorites? This action cannot be undone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveBorrow}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="group overflow-hidden transition-all duration-200 hover:bg-accent/10">
        <div className="flex items-start justify-between gap-4 p-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="line-clamp-1 text-lg font-medium">
                  {resource.resourceTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant={"draft"} className="text-xs">
                    {resource.resourceType === EResourceBookType.EBOOK
                      ? t("ebook")
                      : t("audio book")}
                  </Badge>
                </div>
              </div>
            </div>

            {resource.defaultBorrowDurationDays && (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("borrow duration")}: {resource.defaultBorrowDurationDays}{" "}
                {t("days")}
              </p>
            )}
          </CardContent>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setOpenDelete(true)}
            aria-label="Remove from favorites"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </Card>
    </>
  )
}

export default OverviewBorrowResource
