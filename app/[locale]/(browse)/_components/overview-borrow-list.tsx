"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { useRouter } from "@/i18n/routing"
import { Book, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { localStorageHandler } from "@/lib/utils"
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
import { Separator } from "@/components/ui/separator"
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
  const [borrowLibraryItemIds, setBorrowLibraryItemsIds] = useState<string[]>(
    []
  )
  const [borrowResourceIds, setBorrowResourcesIds] = useState<string[]>([])

  const updateBorrows = () => {
    setBorrowLibraryItemsIds(
      localStorageHandler.getItem(LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS)
    )
    setBorrowResourcesIds(
      localStorageHandler.getItem(LocalStorageKeys.BORROW_RESOURCE_IDS)
    )
  }

  useEffect(() => {
    updateBorrows()
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS ||
        event.key === LocalStorageKeys.BORROW_RESOURCE_IDS
      ) {
        updateBorrows()
      }
    }
    const handleCustomEvent = () => updateBorrows()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(
      LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS,
      handleCustomEvent
    )
    window.addEventListener(
      LocalStorageKeys.BORROW_RESOURCE_IDS,
      handleCustomEvent
    )
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(
        LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS,
        handleCustomEvent
      )
      window.removeEventListener(
        LocalStorageKeys.BORROW_RESOURCE_IDS,
        handleCustomEvent
      )
    }
  }, [])

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
                  localStorageHandler.clear(
                    LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS
                  )
                  localStorageHandler.clear(
                    LocalStorageKeys.BORROW_RESOURCE_IDS
                  )
                  setOpenDelete(false)
                }}
              >
                {t("remove all")}
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <div className="relative">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Book
                      size={20}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                    {borrowResourceIds?.length + borrowLibraryItemIds?.length >
                      0 && (
                      <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-md">
                        {borrowLibraryItemIds.length + borrowResourceIds.length}
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
            <h1 className="font-semibold">{t("books")}</h1>
            {borrowLibraryItemIds.length > 0 &&
              borrowLibraryItemIds.map((libraryItemId) => (
                <OverviewBorrowItem
                  key={libraryItemId}
                  libraryItemId={libraryItemId}
                />
              ))}

            <Separator className="my-4" />
            <h1 className="font-semibold">{t("resources")}</h1>
            {borrowResourceIds.length > 0 &&
              borrowResourceIds.map((libraryItemId) => (
                <OverviewBorrowResource
                  key={libraryItemId}
                  resourceId={libraryItemId}
                />
              ))}
          </div>

          {(borrowLibraryItemIds.length > 0 ||
            borrowResourceIds.length > 0) && (
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                className="px-4"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="size-4" /> {t("remove all")}
              </Button>

              <Button
                variant="outline"
                className="px-4"
                onClick={() => router.push("/borrows")}
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
