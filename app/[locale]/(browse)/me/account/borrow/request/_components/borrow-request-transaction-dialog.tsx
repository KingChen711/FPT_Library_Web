import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { type HubConnection } from "@microsoft/signalr"
import { AudioLines, BookOpen, Clock, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveVerifyPaymentStatus,
  onReceiveVerifyPaymentStatus,
  type SocketVerifyPaymentStatus,
} from "@/lib/signalR/verify-payment-status"
import { EResourceBookType, ETransactionStatus } from "@/lib/types/enums"
import { type PaymentData, type Transaction } from "@/lib/types/models"
import { createBorrowRequestTransaction } from "@/actions/borrows/create-borrow-request-transaction"
import useConfirmTransactionBorrowRequest from "@/hooks/borrow/use-confirm-transaction-borrow-request"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PaymentCard from "@/components/ui/payment-card"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  borrowRequestId: number
  transaction?: Transaction
}

const BorrowRequestTransactionDialog = ({
  borrowRequestId,
  open,
  setOpen,
  transaction,
}: Props) => {
  const { data: borrowRequestResources, isLoading } =
    useConfirmTransactionBorrowRequest(borrowRequestId)
  const t = useTranslations("BookPage.borrow tracking")

  // Setup Transaction
  const router = useRouter()
  const locale = useLocale()
  const { user, isLoadingAuth, accessToken } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isPending, startTransition] = useTransition()
  const isExpireBefore =
    transaction?.transactionStatus === ETransactionStatus.EXPIRED

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
      if (isExpireBefore) return

      const leftTime = paymentData?.expiredAt
        ? paymentData.expiredAt.getTime() - Date.now()
        : 0

      setPaymentStates((prev) => ({ ...prev, leftTime }))
      if (
        leftTime > 0 ||
        !paymentData?.expiredAt ||
        paymentStates.status !== ETransactionStatus.PENDING
      )
        return

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
  }, [paymentData?.expiredAt, paymentStates?.status, isExpireBefore])

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
  }, [paymentStates.canNavigate, paymentStates.navigateTime, router])

  useEffect(() => {
    if (!transaction) return
    setPaymentData({
      description: transaction.description || "",
      expiredAt: transaction.expiredAt ? new Date(transaction.expiredAt) : null,
      orderCode: transaction.transactionCode,
      qrCode: transaction.qrCode || "",
      paymentLinkId: "",
    })
    setPaymentStates({
      canNavigate: false,
      status: ETransactionStatus.PENDING,
      navigateTime: 5,
      leftTime: 0,
    })
  }, [transaction])

  if (isLoadingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!user || (!borrowRequestResources && !transaction)) {
    return null
  }

  function onSubmit() {
    startTransition(async () => {
      const transaction = await createBorrowRequestTransaction(borrowRequestId)

      if (transaction.isSuccess) {
        if (transaction.data.paymentData) {
          setPaymentData({
            ...transaction.data.paymentData,
            expiredAt: transaction.data.paymentData.expiredAt
              ? (() => {
                  const date = new Date(transaction.data.paymentData.expiredAt)
                  //TODO: This can be cleaner, not using hard code
                  date.setHours(date.getHours() - 7)
                  return date
                })()
              : null,
          })
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
      {!paymentData && !transaction && (
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("create borrow request transaction")}</DialogTitle>
            <DialogDescription>
              {t("borrow request transaction desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {borrowRequestResources!.map((resource) => (
              <Card
                key={resource.borrowRequestResourceId}
                className="overflow-hidden border border-muted/50 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <CardHeader className="bg-muted/10 pb-2 pt-3">
                  <CardTitle className="line-clamp-1 text-base">
                    {resource?.resourceTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="progress"
                        className="flex items-center gap-1 border-primary/20 bg-primary/5 text-xs font-normal text-primary"
                      >
                        {resource.libraryResource.resourceType ===
                        EResourceBookType.EBOOK ? (
                          <>
                            <BookOpen className="size-3" />
                            {t("ebook")}
                          </>
                        ) : (
                          <>
                            <AudioLines className="size-3" />
                            {t("audio book")}
                          </>
                        )}
                      </Badge>
                    </div>

                    {resource.defaultBorrowDurationDays && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1.5 size-3.5" />
                        {t("borrow duration")}:&nbsp;
                        {resource.defaultBorrowDurationDays} &nbsp;
                        {t("days")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter className="flex items-center justify-end gap-4">
            <DialogClose>{t("cancel")}</DialogClose>
            <Button onClick={() => onSubmit()} disabled={isPending}>
              {t("submit")}
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

export default BorrowRequestTransactionDialog
