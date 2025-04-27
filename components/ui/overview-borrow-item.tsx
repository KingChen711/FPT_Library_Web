"use client"

import { useState } from "react"
import Image from "next/image"
import { useLibraryStorage } from "@/contexts/library-provider"
import { Link } from "@/i18n/routing"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
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
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import NoData from "./no-data"

type Props = {
  libraryItemId: number
}

const OverviewBorrowItem = ({ libraryItemId }: Props) => {
  const t = useTranslations("BookPage")
  const { data: item, isLoading } = useLibraryItemDetail(libraryItemId)
  const [openDelete, setOpenDelete] = useState(false)

  const { borrowedLibraryItems } = useLibraryStorage()

  const handleRemoveBorrow = () => {
    borrowedLibraryItems.remove(libraryItemId)
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

  if (!item) {
    return <NoData />
  }

  return (
    <>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("remove from borrow list")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("are you sure you want to remove")}
              <span className="mx-2 font-semibold">
                &quot;{item.title}&quot;
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
        <div className="flex items-start gap-4 p-4">
          <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md shadow-sm transition-all duration-200 group-hover:shadow-md">
            <Image
              src={item.coverImage || "/placeholder.svg?height=96&width=64"}
              alt={`${item.title} cover`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          <div className="flex-1 space-y-1">
            <Link
              href={`/books/${item.libraryItemId}`}
              className="line-clamp-2 text-sm font-medium text-primary hover:text-primary hover:underline"
            >
              {item.title}
            </Link>

            {item.authors?.length > 0 && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{item.authors[0].fullName}</span>
                {item.authors.length > 1 && (
                  <span className="text-xs text-muted-foreground/70">
                    +{item.authors.length - 1} more
                  </span>
                )}
              </p>
            )}
          </div>

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

export default OverviewBorrowItem
