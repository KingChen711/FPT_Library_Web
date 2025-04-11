"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { type HubConnection } from "@microsoft/signalr"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveVerifyPaymentStatus,
  onReceiveVerifyPaymentStatus,
  type SocketVerifyPaymentStatus,
} from "@/lib/signalR/verify-payment-status"
import { ETransactionStatus } from "@/lib/types/enums"
import {
  type Author,
  type BookEdition,
  type BorrowRecordDetail,
  type Category,
  type Condition,
  type Employee,
  type Fine,
  type FineBorrow,
  type LibraryItemInstance,
  type PaymentData,
  type Shelf,
} from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import { createBorrowRecordFineTransaction } from "@/actions/borrows/create-borrow-record-fine-transaction"
import { toast } from "@/hooks/use-toast"
import useFormatLocale from "@/hooks/utils/use-format-locale"
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
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import PaymentCard from "@/components/ui/payment-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FineBorrowStatusBadge from "@/components/badges/fine-borrow-status"
import FineTypeBadge from "@/components/badges/fine-type-badge"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  detail: BorrowRecordDetail & {
    libraryItem: BookEdition & {
      shelf: Shelf | null
      category: Category
      authors: Author[]
      libraryItemInstances: LibraryItemInstance[]
    }
    condition: Condition
    returnCondition: Condition | null
    fines: (FineBorrow & { finePolicy: Fine; createByNavigation: Employee })[]
  }
}

const BorrowRecordFineDialog = ({ detail, open, setOpen }: Props) => {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const formatLocale = useFormatLocale()

  // Setup Transaction
  const { user, isLoadingAuth, accessToken } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isPending, startTransition] = useTransition()

  const [paymentStates, setPaymentStates] = useState({
    leftTime: 0,
    canNavigate: false,
    navigateTime: 5,
    status: ETransactionStatus.PENDING,
  })

  // Connect to SignalR
  useEffect(() => {
    if (!accessToken) return
    const connection = connectToSignalR("payment-hub", accessToken)
    setConnection(connection)
    return () => {
      disconnectSignalR(connection)
    }
  }, [accessToken])

  // Receive payment status
  useEffect(() => {
    if (!connection) return
    const callback = (event: SocketVerifyPaymentStatus) => {
      if (event.status === ETransactionStatus.PENDING) return
      setPaymentStates((prev) => ({
        ...prev,
        canNavigate: true,
        leftTime: 0,
        status: event.status,
      }))
    }
    onReceiveVerifyPaymentStatus(connection, callback)
    return () => {
      offReceiveVerifyPaymentStatus(connection, callback)
    }
  }, [connection])

  // Reduce left time
  useEffect(() => {
    const timer = setInterval(() => {
      const leftTime = paymentData?.expiredAt
        ? paymentData.expiredAt.getTime() - Date.now()
        : 0

      setPaymentStates((prev) => ({ ...prev, leftTime }))
      if (leftTime > 0 || !paymentData?.expiredAt) return
      setPaymentStates((prev) => ({
        ...prev,
        leftTime: 0,
        canNavigate: true,
        status: ETransactionStatus.EXPIRED,
      }))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [paymentData?.expiredAt])

  // Reduce navigate time
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paymentStates.canNavigate) return
      const navigateTime = paymentStates.navigateTime - 1
      if (navigateTime <= 0) {
        router.push(`/me/account/borrow`)
        return
      }
      setPaymentStates((prev) => ({ ...prev, navigateTime }))
    }, 1000)
    return () => clearInterval(timer)
  }, [
    detail.borrowRecordId,
    paymentStates.canNavigate,
    paymentStates.navigateTime,
    router,
  ])

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <NoData />
  }

  function onSubmit() {
    startTransition(async () => {
      const transaction = await createBorrowRecordFineTransaction(
        detail.borrowRecordId
      )

      if (transaction.isSuccess) {
        if (transaction.data.paymentData) {
          setPaymentData(transaction.data.paymentData)
          return
        }
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: transaction.data.message,
          variant: "success",
        })
      }

      if (!transaction.isSuccess) {
        toast({
          title:
            locale === "vi"
              ? "Tạo giao dịch thất bại"
              : "Fail to create transaction",
          variant: "danger",
        })
        handleServerActionError(transaction, locale)
        return
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!paymentData && (
        <DialogContent className="max-h-[80vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Fines")}</DialogTitle>
            <DialogDescription asChild>
              <div className="grid w-full">
                <div className="overflow-x-auto rounded-md border">
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-nowrap font-bold">
                          {t("Title")}
                        </TableHead>

                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Fine type")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Fine amount")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Status")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Fine note")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Created at")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Expiry at")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap font-bold">
                          <div className="flex justify-center">
                            {t("Created by")}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.fines.map((fine) => (
                        <TableRow key={fine.fineId}>
                          <TableCell className="text-nowrap">
                            {fine.finePolicy.finePolicyTitle}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              <FineTypeBadge
                                type={fine.finePolicy.conditionType}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {formatPrice(fine.fineAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              <FineBorrowStatusBadge status={fine.status} />
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {fine.fineNote ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      {t("View content")}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {t("Allow borrow more reason")}
                                      </DialogTitle>
                                      <DialogDescription>
                                        <ParseHtml data={fine.fineNote} />
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                "-"
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {fine.createdAt ? (
                                <p>
                                  {format(
                                    fine.createdAt,
                                    "dd MMM yyyy, HH:mm",
                                    {
                                      locale: formatLocale,
                                    }
                                  )}
                                </p>
                              ) : (
                                "-"
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {fine.expiryAt ? (
                                <p>
                                  {format(fine.expiryAt, "dd MMM yyyy, HH:mm", {
                                    locale: formatLocale,
                                  })}
                                </p>
                              ) : (
                                "-"
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {fine.createByNavigation.email}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <DialogClose>
              <Button variant={"ghost"}>Đóng</Button>
            </DialogClose>
            <Button onClick={() => onSubmit()} disabled={isPending}>
              Thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {paymentData && (
        <DialogContent className="flex max-h-[80vh] max-w-6xl items-center justify-center overflow-y-auto">
          <PaymentCard
            paymentStates={paymentStates}
            paymentData={paymentData}
            cancelPaymentUrl={`/me/account/borrow`}
          />
        </DialogContent>
      )}
    </Dialog>
  )
}

export default BorrowRecordFineDialog
