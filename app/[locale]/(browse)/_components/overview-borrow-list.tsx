"use client"

import { useEffect, useState, useTransition } from "react"
import { LocalStorageKeys } from "@/constants"
import { useRouter } from "@/i18n/routing"
import { Book } from "lucide-react"
import { useLocale } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { localStorageHandler } from "@/lib/utils"
import { borrowLibraryItems } from "@/actions/library-item/borrow-library-items"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import OverviewBorrowItem from "@/components/ui/overview-borrow-item"
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  const router = useRouter()
  const [borrowIdList, setBorrowIdList] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const updateBorrows = () => {
    setBorrowIdList(localStorageHandler.getItem(LocalStorageKeys.BORROW))
  }

  useEffect(() => {
    updateBorrows()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKeys.BORROW) {
        updateBorrows()
      }
    }
    const handleCustomEvent = () => updateBorrows()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(LocalStorageKeys.BORROW, handleCustomEvent)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(LocalStorageKeys.BORROW, handleCustomEvent)
    }
  }, [])

  const handleSubmitBorrow = () => {
    startTransition(async () => {
      // updateBorrows()
      const res = await borrowLibraryItems({
        description: null,
        libraryItemIds: borrowIdList.map((id) => Number(id)),
      })
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
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
                  {borrowIdList?.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-md">
                      {borrowIdList.length}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Borrow list</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-4 p-4">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Your Borrow Library Items
          </SheetTitle>
          <SheetDescription>
            Manage your saved books easily. Click on the trash icon to remove
            items.
          </SheetDescription>
        </SheetHeader>

        {borrowIdList.length > 0 &&
          borrowIdList.map((libraryItemId) => (
            <OverviewBorrowItem
              key={libraryItemId}
              libraryItemId={libraryItemId}
            />
          ))}

        {borrowIdList.length > 0 && (
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              className="px-4"
              onClick={() => localStorageHandler.clear(LocalStorageKeys.BORROW)}
            >
              Remove All
            </Button>

            <Button
              variant="outline"
              className="px-4"
              // onClick={() => handleSubmitBorrow()}
              onClick={() => router.push("/borrows")}
            >
              Borrow All
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default OverviewBorrowList
