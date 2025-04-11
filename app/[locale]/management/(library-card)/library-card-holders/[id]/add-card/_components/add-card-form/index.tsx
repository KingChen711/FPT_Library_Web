"use client"

import React, { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { type HubConnection } from "@microsoft/signalr"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import QRCode from "react-qr-code"
import { BeatLoader } from "react-spinners"

import handleServerActionError from "@/lib/handle-server-action-error"
import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveVerifyPaymentStatus,
  onReceiveVerifyPaymentStatus,
  type SocketVerifyPaymentStatus,
} from "@/lib/signalR/verify-payment-status"
import { ETransactionMethod, ETransactionStatus } from "@/lib/types/enums"
import { cn, formatLeftTime } from "@/lib/utils"
import {
  addCardSchema,
  type TAddCardSchema,
} from "@/lib/validations/patrons/cards/add-card"
import { addCard } from "@/actions/library-card/cards/add-card"
import { type PaymentData } from "@/actions/library-card/patrons/create-patron"
import useUploadImage from "@/hooks/media/use-upload-image"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Copitor from "@/components/ui/copitor"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import PackageCard from "@/components/ui/package-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import CancelPaymentDialog from "../../../../../../../../../components/ui/cancel-payment-dialog"
import AddCardAvatarField from "./add-card-avatar-field"
import SelectPackageField from "./select-package-field"

type Props = {
  userId: string
}

function AddCardForm({ userId }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const tTransactionMethod = useTranslations("Badges.TransactionMethod")
  const router = useRouter()

  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const form = useForm<TAddCardSchema>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      userId,
      transactionMethod: ETransactionMethod.CASH,
      confirmPatronHasCash: false,
    },
  })

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const [paymentStates, setPaymentStates] = useState({
    leftTime: 0,
    canNavigate: false,
    navigateTime: 5,
    status: ETransactionStatus.PENDING,
  })
  const { mutateAsync: uploadBookImage } = useUploadImage()

  function onSubmit(values: TAddCardSchema) {
    startTransition(async () => {
      const avatarFile = values.file

      if (avatarFile && values.avatar.startsWith("blob")) {
        const data = await uploadBookImage(avatarFile)
        if (!data) {
          toast({
            title: locale === "vi" ? "Thất bại" : "Fail",
            description:
              locale === "vi" ? "Lỗi không xác định" : "Unknown error",
            variant: "danger",
          })
          return
        }
        values.avatar = data.secureUrl
      }

      values.file = undefined

      const res = await addCard(values)

      if (res.isSuccess) {
        if (res.data.paymentData) {
          setPaymentData(res.data.paymentData)
          return
        }
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })
        router.push(`/management/library-card-holders/${userId}`)
        return
      }

      //*Just do this on fail
      form.setValue("avatar", values.avatar)
      handleServerActionError(res, locale, form)
    })
  }

  const { accessToken } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)

  useEffect(() => {
    if (!accessToken) return

    const connection = connectToSignalR("payment-hub", accessToken)
    setConnection(connection)

    return () => {
      disconnectSignalR(connection)
    }
  }, [accessToken])

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

  //reduce left time
  useEffect(() => {
    const timer = setInterval(() => {
      const leftTime = paymentData?.expiredAt
        ? paymentData.expiredAt.getTime() - Date.now()
        : 0

      setPaymentStates((prev) => ({
        ...prev,
        leftTime,
      }))

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

  //reduce navigate time
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paymentStates.canNavigate) return

      const navigateTime = paymentStates.navigateTime - 1

      if (navigateTime <= 0) {
        router.push(`/management/library-card-holders/${userId}`)
        return
      }

      setPaymentStates((prev) => ({
        ...prev,
        navigateTime,
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentStates.canNavigate, paymentStates.navigateTime, router, userId])

  return (
    <div>
      {!paymentData && (
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{t("Create card")}</h3>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!paymentData && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <SelectPackageField form={form} isPending={isPending} />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("Full name")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AddCardAvatarField form={form} isPending={isPending} />

              <FormField
                control={form.control}
                name="transactionMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t("Transaction method")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value.toString()}
                        className="flex flex-col space-y-1"
                      >
                        {Object.values(ETransactionMethod)
                          .filter((e) => typeof e === "number")
                          .map((method) => (
                            <FormItem
                              key={method}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={method.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tTransactionMethod(method.toString())}
                              </FormLabel>
                            </FormItem>
                          ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("transactionMethod") === ETransactionMethod.CASH && (
                <FormField
                  control={form.control}
                  name="confirmPatronHasCash"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 border-warning bg-warning/10 p-4 shadow">
                      <div className="flex items-center gap-4">
                        <Icons.Alert className="size-6 text-warning" />

                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t("Confirm patron has cash title")}
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                className="size-4 border-border"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="flex items-center gap-4">
                              <FormDescription>
                                {t("Confirm patron has cash description")}
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-x-4">
                <Button
                  disabled={isPending}
                  variant="secondary"
                  className="float-right mt-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/management/library-card-holders/${userId}`)
                  }}
                >
                  {t("Cancel")}
                </Button>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="float-right mt-4"
                >
                  {t("Continue")}
                  {isPending && (
                    <Loader2 className="ml-1 size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {paymentData && (
          <div className="container mx-auto flex max-w-5xl items-center justify-center p-6">
            <Card className="w-full overflow-hidden">
              <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
                <CardTitle className="text-center text-xl">
                  {t("QR payment")}
                </CardTitle>
                <CardDescription className="text-center text-primary-foreground/80">
                  {t("Please scan the QR code below to make payment")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center p-6 md:w-1/2 md:border-r">
                    <div className="mb-4 flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      {paymentStates.status === ETransactionStatus.PENDING ? (
                        <>
                          {t("Pending payment")}{" "}
                          <BeatLoader color="#fff" size={10} className="ml-2" />
                        </>
                      ) : (
                        <>
                          {t("Auto redirect after n seconds", {
                            seconds: paymentStates.navigateTime,
                          })}
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <div
                        className={cn(
                          "rounded-md border-2 bg-white p-4",
                          paymentStates.status !== ETransactionStatus.PENDING &&
                            "blur"
                        )}
                      >
                        <QRCode
                          value={paymentData.qrCode}
                          size={200}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          viewBox={`0 0 256 256`}
                        />
                      </div>

                      <Image
                        alt="status_payment"
                        src={
                          paymentStates.status === ETransactionStatus.PAID
                            ? "/assets/images/payment-success.png"
                            : "/assets/images/payment-fail.png"
                        }
                        width={236}
                        height={236}
                        className={cn(
                          "absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 object-cover",
                          paymentStates.status === ETransactionStatus.PENDING &&
                            "invisible"
                        )}
                      />
                    </div>
                    <Badge
                      variant="default"
                      className="mt-4 text-sm font-medium"
                    >
                      {paymentStates.status === ETransactionStatus.PENDING && (
                        <>
                          {t("Time remaining")}:{" "}
                          {formatLeftTime(paymentStates.leftTime / 1000)}
                        </>
                      )}
                      {paymentStates.status === ETransactionStatus.PAID &&
                        t("Payment successful")}
                      {paymentStates.status === ETransactionStatus.CANCELLED &&
                        t("Payment cancelled")}
                      {paymentStates.status === ETransactionStatus.EXPIRED &&
                        t("Payment expired")}
                    </Badge>

                    <CancelPaymentDialog
                      currentStatus={paymentStates.status}
                      orderCode={paymentData.orderCode}
                      paymentLinkId={paymentData.paymentLinkId}
                      userId={userId}
                    />
                  </div>

                  {/* Payment Details Section */}
                  <div className="p-6 md:w-1/2">
                    <div className="w-full space-y-4">
                      <PackageCard package={form.watch("package")} />

                      <div>
                        <h3 className="mb-2 text-sm font-medium">
                          {t("Payment description")}
                        </h3>
                        <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                          <p className="flex-1 break-all text-sm">
                            {paymentData.description}
                          </p>
                          <Copitor content={paymentData.description} />
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <h3 className="mb-2 font-medium">
                          {t("How to make payment")}
                        </h3>
                        <ol className="list-decimal space-y-1 pl-5">
                          <li>{t("qr payment guide 1")}</li>
                          <li>{t("qr payment guide 2")}</li>
                          <li>{t("qr payment guide 3")}</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddCardForm
