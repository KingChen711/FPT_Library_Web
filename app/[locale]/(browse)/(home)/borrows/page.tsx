"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { useAuth } from "@/contexts/auth-provider"
import { useBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { CheckCircle, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { localStorageHandler } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import BorrowLibraryItemCard from "./_components/borrow-library-item-card"
import BorrowResourceCard from "./_components/borrow-resource-card"
import CheckBorrowRequestDialog from "./_components/check-borrow-request-dialog"

const BorrowsPage = () => {
  const locale = useLocale()
  const { user, isLoadingAuth } = useAuth()
  const t = useTranslations("BookPage")
  const [openCheckBorrow, setOpenCheckBorrow] = useState(false)
  const { selectedLibraryItemIds, selectedResourceIds, clear, selectAll } =
    useBorrowRequestStore()

  // Get library items from local storage
  const [borrowLibraryItemIds, setBorrowLibraryItemIds] = useState<string[]>([])
  // Get resources from local storage
  const [borrowResourceIds, setBorrowResourcesIds] = useState<string[]>([])

  const updateBorrows = () => {
    setBorrowLibraryItemIds(
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

  if (isLoadingAuth) {
    return null
  }

  const handleCheckAvailable = () => {
    if (!user) {
      toast({
        title: t("error toast"),
        description:
          locale === "vi"
            ? "Vui lòng đăng nhập để mượn sách"
            : "Please login to borrow",
        variant: "warning",
      })
      return
    }
    setOpenCheckBorrow(true)
  }

  return (
    <>
      <CheckBorrowRequestDialog
        open={openCheckBorrow}
        setOpen={setOpenCheckBorrow}
      />
      <div className="container mx-auto space-y-6 py-6">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">{t("borrow list")}</h1>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                className="w-full pl-8"
              />
            </div>
          </div>
        </section>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedLibraryItemIds.length +
                      selectedResourceIds.length ===
                    borrowLibraryItemIds.length + borrowResourceIds.length
                  }
                  onCheckedChange={() => {
                    if (
                      selectedLibraryItemIds.length +
                        selectedResourceIds.length ===
                      borrowLibraryItemIds.length + borrowResourceIds.length
                    ) {
                      clear()
                    } else {
                      selectAll(borrowLibraryItemIds, borrowResourceIds)
                    }
                  }}
                />
                <label
                  htmlFor="select-all"
                  className="cursor-pointer text-sm font-medium"
                >
                  {t("select all")} (
                  {selectedLibraryItemIds.length + selectedResourceIds.length}/
                  {borrowLibraryItemIds.length + borrowResourceIds.length}{" "}
                  {t("selected items")})
                </label>
              </div>

              <Button
                variant={"outline"}
                disabled={
                  selectedLibraryItemIds.length === 0 &&
                  selectedResourceIds.length === 0
                }
                onClick={handleCheckAvailable}
              >
                <CheckCircle className="size-4" /> {t("borrow")}
              </Button>
            </div>

            {/* Get data from Local storage */}
            <div className="flex flex-col gap-4 p-4">
              <h1 className="font-semibold">{t("books")}</h1>
              {borrowLibraryItemIds &&
                borrowLibraryItemIds.length > 0 &&
                borrowLibraryItemIds.map((id) => (
                  <BorrowLibraryItemCard key={id} libraryItemId={id} />
                ))}

              <h1 className="font-semibold">{t("resources")}</h1>
              {borrowResourceIds &&
                borrowResourceIds.length > 0 &&
                borrowResourceIds.map((id) => (
                  <BorrowResourceCard key={id} resourceId={id} />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BorrowsPage
