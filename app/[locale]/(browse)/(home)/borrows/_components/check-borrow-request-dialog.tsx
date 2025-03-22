"use client"

import { useEffect, useState, useTransition } from "react"
import { useBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { createBorrowRequest } from "@/actions/borrows/create-borrow-request"
import useCheckAvailableBorrowRequest from "@/hooks/borrow/use-check-available-borrow-request"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import AvailableBorrowCard from "./available-borrow-card"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const CheckBorrowRequestDialog = ({ open, setOpen }: Props) => {
  const t = useTranslations("BookPage")
  const locale = useLocale()
  const { selectedIds } = useBorrowRequestStore()
  const [isPending, startTransition] = useTransition()
  const [allowToReserveItems, setAllowToReserveItems] = useState<number[]>([])

  const { data, isLoading, refetch } =
    useCheckAvailableBorrowRequest(selectedIds)

  const isAllowedBorrowRequest: boolean =
    data?.alreadyBorrowedItems.length === 0 &&
    data?.alreadyRequestedItems.length === 0 &&
    data?.alreadyReservedItems.length === 0

  useEffect(() => {
    refetch()
  }, [open, refetch])

  if (isLoading) {
    return <Loader2 className="size-6 animate-spin" />
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await createBorrowRequest({
        description: "",
        libraryItemIds:
          data?.allowToBorrowItems?.map((id) => id.libraryItemId) || [],
        reservationItemIds: allowToReserveItems,
      })
      console.log("🚀 ~ startTransition ~ res:", res)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("borrow list")}</DialogTitle>
        </DialogHeader>

        {/* Succeed to request borrow */}
        {isAllowedBorrowRequest && data && (
          <div className="flex flex-col gap-2">
            {data?.allowToBorrowItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  {t("allow to borrow")} ({data?.allowToBorrowItems.length})
                </h1>
                {data?.allowToBorrowItems.map((item) => (
                  <AvailableBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}

            {data?.allowToReserveItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  {t("allow to reserve")} ({data?.allowToReserveItems.length})
                </h1>
                <p className="text-danger">{t("allow to reserve message")}</p>
                {data?.allowToReserveItems.map((item) => (
                  <AvailableBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                    allowToReserveItems={allowToReserveItems}
                    setAllowToReserveItems={setAllowToReserveItems}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fail to request borrow */}
        {!isAllowedBorrowRequest && data && selectedIds.length > 0 && (
          <div className="flex flex-col gap-2">
            {data?.alreadyRequestedItems?.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  {t("already requested items")} (
                  {data?.alreadyRequestedItems.length})
                </h1>
                <p className="text-danger">
                  {t("the document has been requested by you")}. &nbsp;
                  {t("please delete from borrow list")}
                </p>
                {data?.alreadyRequestedItems.map((item) => (
                  <AvailableBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}

            {data?.alreadyBorrowedItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  {t("already borrowed items")} (
                  {data?.alreadyBorrowedItems.length}
                  &nbsp;items)
                </h1>
                <p className="text-danger">
                  {t("the document is being borrowed by you")}. &nbsp;
                  {t("please delete from borrow list")}
                </p>
                {data?.alreadyBorrowedItems.map((item) => (
                  <AvailableBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}

            {data?.alreadyReservedItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  {t("already reserved items")} (
                  {data?.alreadyReservedItems.length}
                  &nbsp; items)
                </h1>
                <p className="text-danger">
                  {t("the document has been booked by you")}. &nbsp;
                  {t("please delete from borrow list")}
                </p>
                {data?.alreadyReservedItems.map((item) => (
                  <AvailableBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>{t("cancel")}</DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!isAllowedBorrowRequest || isPending}
          >
            {t("continue")}
            {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CheckBorrowRequestDialog
