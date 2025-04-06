"use client"

import { useState } from "react"
import { useLibraryStorage } from "@/contexts/library-provider"
import { useRouter } from "@/i18n/routing"
import { Book, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import OverviewBorrowItem from "@/components/ui/overview-borrow-item"
import OverviewBorrowResource from "@/components/ui/overview-borrow-resource"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const OverviewBorrowList = () => {
  const t = useTranslations("BookPage")
  const router = useRouter()
  const [openDelete, setOpenDelete] = useState(false)
  const [openSheet, setOpenSheet] = useState(false)
  const { borrowedLibraryItems, borrowedResources } = useLibraryStorage()

  return (
    <>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("are you absolutely sure to delete your borrow list")}
            </DialogTitle>
            <DialogDescription>{t("cannot undo")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2">
            <DialogClose>{t("cancel")}</DialogClose>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  borrowedLibraryItems.clear()
                  borrowedResources.clear()
                  setOpenDelete(false)
                }}
              >
                {t("remove all")}
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <div className="relative">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenSheet(true)}
                    className="relative"
                  >
                    <Book
                      size={20}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                    {borrowedResources?.items.length +
                      borrowedLibraryItems?.items.length >
                      0 && (
                      <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-primary-foreground shadow-md">
                        {borrowedLibraryItems.items.length +
                          borrowedResources.items.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("borrow list")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-4 p-4">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">
              {t("your borrow library items")}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {borrowedLibraryItems.items.length > 0 && (
              <div className="space-y-2">
                <h1 className="font-semibold">{t("books")}</h1>
                {borrowedLibraryItems.items.map((libraryItemId) => (
                  <OverviewBorrowItem
                    key={libraryItemId}
                    libraryItemId={libraryItemId}
                  />
                ))}
              </div>
            )}

            {borrowedResources.items.length > 0 && (
              <div className="space-y-2">
                <h1 className="font-semibold">{t("resources")}</h1>
                {borrowedResources.items.map((resourceId) => (
                  <OverviewBorrowResource
                    key={resourceId}
                    resourceId={resourceId}
                  />
                ))}
              </div>
            )}
          </div>

          {(borrowedLibraryItems.items.length > 0 ||
            borrowedResources.items.length > 0) && (
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                className="px-4"
                onClick={() => {
                  setOpenDelete(true)
                  setOpenSheet(false)
                }}
              >
                <Trash2 className="size-4" /> {t("remove all")}
              </Button>

              <Button
                variant="outline"
                className="px-4"
                onClick={() => {
                  router.push("/borrows")
                  setOpenSheet(false)
                }}
              >
                {t("borrow all")}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default OverviewBorrowList
