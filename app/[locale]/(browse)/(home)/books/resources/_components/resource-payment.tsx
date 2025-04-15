"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { type HubConnection } from "@microsoft/signalr"
import { BookOpen, Clock, DollarSign, Loader2 } from "lucide-react"
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
import { cn, formatPrice } from "@/lib/utils"
import { createDigitalBorrowTransaction } from "@/actions/library-item/create-digital-borrow-transaction"
import { type ResourcePublic } from "@/hooks/library-items/use-resource-detail"
import useGetPaymentMethods from "@/hooks/payment-methods/use-get-payment-method"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  open: boolean
  setOpen: (value: boolean) => void
  selectedResource: ResourcePublic
  libraryItemId: number
  resourceId: number
}

const formSchema = z.object({
  libraryCardPackageId: z.number().int().positive().nullable(),
  resourceId: z.number().int().positive(),
  description: z.string().nullable().catch(null),
  transactionType: z.number().int().positive(),
  paymentMethodId: z.number().int().positive(),
})

const BorrowDigitalConfirm = ({
  open,
  setOpen,
  selectedResource,
  libraryItemId,
  resourceId,
}: Props) => {
  const t = useTranslations("BookPage")
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const { user, isLoadingAuth, accessToken } = useAuth()
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods()
  const [isPending, startTransition] = useTransition()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
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
      transactionType: 1,
      paymentMethodId: 1,
    },
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
        router.push(`/books/${searchParams.get("libraryItemId")}`)
        return
      }
      setPaymentStates((prev) => ({ ...prev, navigateTime }))
    }, 1000)
    return () => clearInterval(timer)
  }, [
    libraryItemId,
    paymentStates.canNavigate,
    paymentStates.navigateTime,
    router,
    searchParams,
  ])

  useEffect(() => {
    console.log(open)
  }, [open])

  if (isLoadingAuth || isLoadingPaymentMethods) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!user && open) {
    router.push("/login")
  }

  if (!user || !paymentMethods) {
    return null
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const transaction = await createDigitalBorrowTransaction(
        {
          libraryCardPackageId: null,
          resourceId: values.resourceId,
          description: null,
          paymentMethodId: values.paymentMethodId,
          transactionType: 1,
        },
        +libraryItemId
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
        handleServerActionError(transaction, locale, form)
        return
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("sm:max-w-xl", {
          paymentData: "sm:max-w-2xl",
        })}
      >
        <DialogHeader>
          <DialogTitle>{t("borrow resource confirm")}</DialogTitle>
        </DialogHeader>

        {!paymentData && (
          <div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4" />
                <span className="font-medium">{t("title")}:</span>&nbsp;
                {selectedResource.resourceTitle}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-4" />
                <span className="font-medium">{t("resource type")}:</span>&nbsp;
                {selectedResource.resourceType}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-4" />
                <span className="font-medium">{t("borrow price")}:</span>&nbsp;
                <span className="font-semibold text-success">
                  {formatPrice(selectedResource.borrowPrice!)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span className="font-medium">{t("borrow duration")}:</span>
                &nbsp;
                {selectedResource.defaultBorrowDurationDays} {t("days")}
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-4 space-y-2"
              >
                <FormField
                  control={form.control}
                  name="paymentMethodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("payment methods")}</FormLabel>
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
                {user &&
                  (user.libraryCard ? (
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
                        {t("borrow")}
                        {isPending && <Loader2 className="animate-spin" />}
                      </Button>
                    </div>
                  ) : (
                    <Button asChild variant={"link"}>
                      <Link
                        href={"/me/account/library-card"}
                        className="mt-6 underline"
                      >
                        {t("warning 1")}
                      </Link>
                    </Button>
                  ))}
              </form>
            </Form>
          </div>
        )}

        {paymentData && (
          <PaymentCard
            paymentStates={paymentStates}
            paymentData={paymentData}
            cancelPaymentUrl={`/books/${libraryItemId}`}
          />
        )}

        {!user && (
          <Button asChild variant={"link"}>
            <Link href={"/login"} className="mt-6 underline">
              {t("warning 2")}
            </Link>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BorrowDigitalConfirm
