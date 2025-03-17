"use client"

import { useState } from "react"
import Image from "next/image"
import { LocalStorageKeys } from "@/constants"
import { Link } from "@/i18n/routing"
import { BookOpen, Calendar, Trash2 } from "lucide-react"

import { localStorageHandler } from "@/lib/utils"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import NoData from "./no-data"

type Props = {
  libraryItemId: string
}

const OverviewFavoriteItem = ({ libraryItemId }: Props) => {
  const { data: item, isLoading } = useLibraryItemDetail(libraryItemId)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleRemoveFavorite = () => {
    localStorageHandler.setItem(LocalStorageKeys.FAVORITE, libraryItemId)
    setShowDeleteConfirm(false)
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
              className="line-clamp-2 font-medium text-foreground hover:text-primary hover:underline"
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

            <div className="flex flex-wrap gap-2 pt-1">
              {item.publisher && (
                <Badge variant="default" className="text-xs font-normal">
                  {item.publisher}
                </Badge>
              )}

              {item.publicationYear && (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 text-xs font-normal"
                >
                  <Calendar className="size-3" />
                  {item.publicationYear}
                </Badge>
              )}

              {item.pageCount && (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 text-xs font-normal"
                >
                  <BookOpen className="size-3" />
                  {item.pageCount} pages
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Remove from favorites"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove
              <span className="font-semibold">&quot;{item.title}&quot;</span>
              from your favorites? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFavorite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default OverviewFavoriteItem
