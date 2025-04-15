"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useLibraryStorage } from "@/contexts/library-provider"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

import BorrowLibraryItemCard from "./_components/borrow-library-item-card"
import BorrowResourceCard from "./_components/borrow-resource-card"
import CheckBorrowRequestDialog from "./_components/check-borrow-request-dialog"

export type SelectedBorrow = {
  selectedLibraryItemIds: number[]
  selectedResourceIds: number[]
}
const BorrowsPage = () => {
  const locale = useLocale()
  const { user, isLoadingAuth } = useAuth()
  const t = useTranslations("BookPage")
  const [openCheckBorrow, setOpenCheckBorrow] = useState(false)
  const [selectedBorrow, setSelectedBorrow] = useState<SelectedBorrow>({
    selectedLibraryItemIds: [],
    selectedResourceIds: [],
  })

  const { borrowedLibraryItems, borrowedResources } = useLibraryStorage()

  if (isLoadingAuth) {
    return <Loader2 className="animate-spin" />
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
        selectedBorrow={selectedBorrow}
        setSelectedBorrow={setSelectedBorrow}
      />
      <div className="container mx-auto space-y-2">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">{t("borrow list")}</h1>
        </section>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={
                    [
                      ...selectedBorrow.selectedLibraryItemIds,
                      ...selectedBorrow.selectedResourceIds,
                    ].length ===
                    [...borrowedLibraryItems.items, ...borrowedResources.items]
                      .length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBorrow({
                        selectedLibraryItemIds: borrowedLibraryItems.items,
                        selectedResourceIds: borrowedResources.items,
                      })
                    } else {
                      setSelectedBorrow({
                        selectedLibraryItemIds: [],
                        selectedResourceIds: [],
                      })
                    }
                  }}
                />
                <label
                  htmlFor="select-all"
                  className="cursor-pointer text-sm font-medium"
                >
                  {t("select all")} (
                  {selectedBorrow.selectedLibraryItemIds.length +
                    selectedBorrow.selectedResourceIds.length}
                  /
                  {borrowedLibraryItems.items.length +
                    borrowedResources.items.length}
                  &nbsp;
                  {t("selected items")})
                </label>
              </div>

              <Button
                disabled={
                  selectedBorrow.selectedLibraryItemIds.length === 0 &&
                  selectedBorrow.selectedResourceIds.length === 0
                }
                onClick={handleCheckAvailable}
              >
                {t("borrow")}
              </Button>
            </div>

            {/* Get data from Local storage */}
            <div className="flex flex-col gap-4 p-4">
              {borrowedLibraryItems.items &&
                borrowedLibraryItems.items.length > 0 && (
                  <div className="space-y-4">
                    <h1 className="font-semibold">{t("books")}</h1>
                    {borrowedLibraryItems.items.map((id) => (
                      <BorrowLibraryItemCard
                        key={`library-item-${id}`}
                        libraryItemId={id}
                        selectedBorrow={selectedBorrow}
                        setSelectedBorrow={setSelectedBorrow}
                      />
                    ))}
                  </div>
                )}

              {borrowedResources.items &&
                borrowedResources.items.length > 0 && (
                  <div className="space-y-4">
                    <h1 className="font-semibold">{t("resources")}</h1>
                    {borrowedResources.items.map((id) => (
                      <BorrowResourceCard
                        key={`resource-${id}`}
                        resourceId={id}
                        selectedBorrow={selectedBorrow}
                        setSelectedBorrow={setSelectedBorrow}
                      />
                    ))}
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BorrowsPage
