"use client"

import { useEffect, useTransition } from "react"
import { userBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { Loader2 } from "lucide-react"
import { useLocale } from "next-intl"

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

import NotAllowBorrowCard from "./not-allowed-borrow-card"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const CheckBorrowRequestDialog = ({ open, setOpen }: Props) => {
  const locale = useLocale()
  const { selectedIds } = userBorrowRequestStore()
  const [isPending, startTransition] = useTransition()

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

  console.log("🚀 ~ CheckBorrowRequestDialog ~ data:", data)

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await createBorrowRequest({
        description: "",
        libraryItemIds:
          data?.allowToBorrowItems?.map((id) => id.libraryItemId) || [],
        reservationItemIds:
          data?.allowToReserveItems?.map((id) => id.libraryItemId) || [],
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Your borrow list?</DialogTitle>
        </DialogHeader>

        {/* Succeed to request borrow */}
        {isAllowedBorrowRequest && data && (
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-semibold">Allow to borrow</h1>
              {data?.allowToBorrowItems.map((item) => (
                <div key={item.libraryItemId}>
                  <p>✅ {item.title}</p>
                </div>
              ))}
            </div>

            <div>
              <h1 className="font-semibold">Allow to reserve</h1>
              {data?.allowToReserveItems.map((item) => (
                <div key={item.libraryItemId}>
                  <p>✅ {item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fail to request borrow */}
        {!isAllowedBorrowRequest && data && selectedIds.length > 0 && (
          <div className="flex flex-col gap-2">
            {data?.alreadyRequestedItems?.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  Already Requested Items ({data?.alreadyRequestedItems.length}
                  &nbsp; items)
                </h1>
                <p className="text-danger">
                  Bạn đang chờ duyệt {data?.alreadyRequestedItems.length} quyển
                  này. Vui lòng xóa khỏi danh sách mượn.
                </p>
                {data?.alreadyRequestedItems.map((item) => (
                  <NotAllowBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}

            {data?.alreadyBorrowedItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  Already Borrow Items ({data?.alreadyBorrowedItems.length}
                  &nbsp;items)
                </h1>
                <p className="text-danger">
                  Bạn đang mượn {data?.alreadyBorrowedItems.length} quyển này.
                  Vui lòng xóa khỏi danh sách mượn.
                </p>
                {data?.alreadyBorrowedItems.map((item) => (
                  <NotAllowBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}

            {data?.alreadyReservedItems.length > 0 && (
              <div>
                <h1 className="font-semibold">
                  Already Reserve Items ({data?.alreadyReservedItems.length}
                  &nbsp; items)
                </h1>
                <p className="text-danger">
                  Bạn đã đặt {data?.alreadyReservedItems.length} quyển này. Vui
                  lòng xóa khỏi danh sách mượn.
                </p>
                {data?.alreadyReservedItems.map((item) => (
                  <NotAllowBorrowCard
                    key={item.libraryItemId}
                    libraryItem={item}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>Cancel</DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!isAllowedBorrowRequest || isPending}
          >
            Submit
            {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CheckBorrowRequestDialog
