"use client"

import { useEffect, useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { type HubConnection } from "@microsoft/signalr"
import { BadgeCheck, BookOpen, Clock, DollarSign, Loader2 } from "lucide-react"
import { useLocale } from "next-intl"
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
import { type BookResource, type PaymentData } from "@/lib/types/models"
import { cn, formatPrice } from "@/lib/utils"
import { createDigitalBorrowTransaction } from "@/actions/library-item/create-digital-borrow-transaction"
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
  selectedResource: BookResource
  libraryItemId: string
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
}: Props) => {
  const locale = useLocale()
  const router = useRouter()
  const { user, isLoadingAuth, accessToken } = useAuth()
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods()
  const [isPending, startTransition] = useTransition()
  const [connection, setConnection] = useState<HubConnection | null>(null)

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
      resourceId: selectedResource.resourceId,
      description: null,
      transactionType: 1,
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
        router.push(`/books/${libraryItemId}`)
        return
      }
      setPaymentStates((prev) => ({ ...prev, navigateTime }))
    }, 1000)
    return () => clearInterval(timer)
  }, [paymentStates.canNavigate, paymentStates.navigateTime, router])

  if (isLoadingAuth || isLoadingPaymentMethods) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      console.log("🚀 ~ onSubmit ~ data:", values)
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
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <BadgeCheck className="size-5 text-green-600" />
            Xác nhận mượn tài liệu?
          </DialogTitle>
        </DialogHeader>

        {!paymentData && (
          <div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-gray-500" />
                <span className="font-medium">Tiêu đề:</span>{" "}
                {selectedResource.resourceTitle}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-gray-500" />
                <span className="font-medium">Loại tài liệu:</span>{" "}
                {selectedResource.resourceType}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-gray-500" />
                <span className="font-medium">Giá mượn:</span>{" "}
                <span className="font-semibold text-green-600">
                  {formatPrice(selectedResource.borrowPrice!)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-gray-500" />
                <span className="font-medium">Thời hạn:</span>{" "}
                {selectedResource.defaultBorrowDurationDays} ngày
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
                      <FormLabel>Payment Method</FormLabel>
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
                          Huỷ
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        variant="default"
                        disabled={isPending}
                        className="flex items-center gap-2"
                      >
                        Borrow now
                        {isPending && <Loader2 className="animate-spin" />}
                      </Button>
                    </div>
                  ) : (
                    <Button asChild variant={"link"}>
                      <Link
                        href={"/me/account/library-card"}
                        className="mt-6 underline"
                      >
                        Please register your library card to borrow the resource
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
              Please login to borrow the resource
            </Link>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BorrowDigitalConfirm
