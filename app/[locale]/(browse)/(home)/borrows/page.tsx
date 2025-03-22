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

import BorrowCard from "./_components/borrow-card"
import CheckBorrowRequestDialog from "./_components/check-borrow-request-dialog"

const BorrowsPage = () => {
  const locale = useLocale()
  const { user, isLoadingAuth } = useAuth()
  const t = useTranslations("BookPage")
  const [openCheckBorrow, setOpenCheckBorrow] = useState(false)
  const { selectedIds, clear, selectAll } = useBorrowRequestStore()
  const [borrowIdList, setBorrowIdList] = useState<string[]>([])
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

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedIds.length === borrowIdList.length}
                  onCheckedChange={() => {
                    if (selectedIds.length === borrowIdList.length) {
                      clear()
                    } else {
                      selectAll(borrowIdList)
                    }
                  }}
                />
                <label
                  htmlFor="select-all"
                  className="cursor-pointer text-sm font-medium"
                >
                  {t("select all")} ({selectedIds.length}/{borrowIdList.length}{" "}
                  {t("selected items")})
                </label>
              </div>

              <Button
                variant={"outline"}
                disabled={selectedIds.length === 0}
                onClick={handleCheckAvailable}
              >
                <CheckCircle className="size-4" /> {t("borrow")}
              </Button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              {borrowIdList &&
                borrowIdList.length > 0 &&
                borrowIdList.map((id) => (
                  <BorrowCard key={id} libraryItemId={id} />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BorrowsPage
