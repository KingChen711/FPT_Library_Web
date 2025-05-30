import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { type HubConnection } from "@microsoft/signalr"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveVerifyPaymentStatus,
  onReceiveVerifyPaymentStatus,
  type SocketVerifyPaymentStatus,
} from "@/lib/signalR/verify-payment-status"
import { ETransactionStatus } from "@/lib/types/enums"
import { type PaymentData } from "@/lib/types/models"
import { extendDigitalBorrowTransaction } from "@/actions/library-item/extend-digital-borrow-transactions"
import useGetPaymentMethods from "@/hooks/payment-methods/use-get-payment-method"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PaymentCard from "@/components/ui/payment-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  resourceId: number
  open: boolean
  setOpen: (open: boolean) => void
}

const formSchema = z.object({
  libraryCardPackageId: z.number().int().positive().nullable(),
  resourceId: z.number().int().positive(),
  description: z.string().nullable().catch(null),
  transactionType: z.number().int().positive(),
  paymentMethodId: z.number().int().positive(),
})

const DigitalBorrowExtendConfirm = ({ open, setOpen, resourceId }: Props) => {
  const t = useTranslations("BookPage.borrow tracking")

  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [connection, setConnection] = useState<HubConnection | null>(null)
  const { user, isLoadingAuth, accessToken } = useAuth()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods()

  const [paymentStates, setPaymentStates] = useState({
    leftTime: 0,
    canNavigate: false,
    navigateTime: 5,
    status: ETransactionStatus.PENDING,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      libraryCardPackageId: null,
      resourceId: resourceId,
      description: null,
      transactionType: 4,
      paymentMethodId: 1,
    },
  })

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
        router.push("/me/account/borrow")
        return
      }
      setPaymentStates((prev) => ({ ...prev, navigateTime }))
    }, 1000)
    return () => clearInterval(timer)
  }, [paymentStates.canNavigate, paymentStates.navigateTime, router])

  if (isLoadingAuth || isLoadingPaymentMethods) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const transaction = await extendDigitalBorrowTransaction({
        libraryCardPackageId: null,
        resourceId: values.resourceId,
        description: null,
        paymentMethodId: values.paymentMethodId,
        transactionType: 4,
      })

      if (transaction.isSuccess) {
        if (transaction.data.paymentData) {
          setPaymentData({
            ...transaction.data.paymentData,
            expiredAt: transaction.data.paymentData.expiredAt
              ? (() => {
                  const date = new Date(transaction.data.paymentData.expiredAt)

                  return date
                })()
              : null,
          })
          return
        }
        if (transaction.data.message)
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
        handleServerActionError(transaction, locale, form)
        return
      }
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("extend")}</DialogTitle>
            <DialogDescription>{t("extend desc")}</DialogDescription>
          </DialogHeader>

          {paymentData && (
            <PaymentCard
              paymentStates={paymentStates}
              paymentData={paymentData}
              cancelPaymentUrl={"/me/account/borrow"}
            />
          )}

          {!paymentData && (
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="paymentMethodId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("payment method")}</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(Number.parseInt(value))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods &&
                                paymentMethods?.map((paymentMethod) => (
                                  <SelectItem
                                    key={paymentMethod.paymentMethodId}
                                    value={paymentMethod.paymentMethodId.toString()}
                                  >
                                    {paymentMethod.methodName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6 flex justify-end gap-3">
                    <DialogClose asChild>
                      <Button variant="ghost" disabled={isPending}>
                        {t("cancel")}
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isPending}
                      className="flex items-center gap-2"
                    >
                      {t("extend")}
                      {isPending && <Loader2 className="animate-spin" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DigitalBorrowExtendConfirm
