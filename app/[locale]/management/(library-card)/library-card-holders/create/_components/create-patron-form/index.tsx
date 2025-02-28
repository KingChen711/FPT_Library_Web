"use client"

import React, { useCallback, useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { type HubConnection } from "@microsoft/signalr"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
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
import {
  EGender,
  ETransactionMethod,
  ETransactionStatus,
} from "@/lib/types/enums"
import { cn, formatLeftTime } from "@/lib/utils"
import {
  createPatronSchema,
  type TCreatePatronSchema,
} from "@/lib/validations/patrons/create-patron"
import { uploadBookImage } from "@/actions/books/upload-medias"
import {
  createPatron,
  type PaymentData,
} from "@/actions/library-card/patrons/create-patron"
import useCheckAvatar from "@/hooks/ai/use-check-avatar"
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
  createCalendarDate,
  DateTimePicker,
} from "@/components/ui/date-time-picker/index"
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
import { Label } from "@/components/ui/label"
import PackageCard from "@/components/ui/package-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import CancelPaymentDialog from "./cancel-payment-dialog"
import SelectPackageField from "./select-package-field"

function CreatePatronForm() {
  const timezone = getLocalTimeZone()
  const t = useTranslations("LibraryCardManagementPage")
  const tTransactionMethod = useTranslations("Badges.TransactionMethod")
  const router = useRouter()

  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const { mutate: checkAvatar, isPending: checkingAvatar } = useCheckAvatar()

  const form = useForm<TCreatePatronSchema>({
    resolver: zodResolver(createPatronSchema),
    defaultValues: {
      gender: EGender.MALE,
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

  const watchFile = form.watch("file")
  const watchDetectedFacesResult = form.watch("detectedFacesResult")
  const watchValidAvatar =
    watchDetectedFacesResult === undefined
      ? undefined
      : watchDetectedFacesResult.faces.length === 1

  function onSubmit(values: TCreatePatronSchema) {
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

      const res = await createPatron(values)
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
        router.push("/management/library-card-holders")
        return
      }

      //*Just do this on fail
      form.setValue("avatar", values.avatar)
      handleServerActionError(res, locale, form)
    })
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      form.setValue(`file`, file)
      const url = URL.createObjectURL(file)
      form.setValue(`avatar`, url)
      form.clearErrors(`avatar`)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024,
    disabled: isPending,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      if (error?.code === "file-too-large") {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description: locale === "vi" ? "Ảnh quá lớn" : "Image is too large",
          variant: "danger",
        })
      } else if (error?.code === "file-invalid-type") {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi" ? "Tệp không hợp lệ" : "Invalid file type",
          variant: "danger",
        })
      }
    },
  })

  const handleCheckAvatar = useCallback(() => {
    const formData = new FormData()

    if (!watchFile) return

    formData.append("file", watchFile)
    formData.append("attributes", "gender")

    checkAvatar(formData, {
      onSuccess: (data) => {
        form.setValue(`detectedFacesResult`, data)
        const countFaces = data.faces.length
        if (countFaces === 0) {
          form.setError("avatar", { message: "validAvatarAI0" })
          return
        }
        if (countFaces > 1) {
          form.setError("avatar", { message: "validAvatarAI*" })
          return
        }

        const gender = data.faces[0].attributes?.gender?.value
        if (gender) {
          form.setValue("gender", gender)
        }
        form.clearErrors(`avatar`)
      },
      onError: () => {
        form.setValue(`detectedFacesResult`, undefined)

        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Lỗi không xác định khi kiểm tra ảnh bìa"
              : "Unknown error while checking cover image",
          variant: "danger",
        })
      },
    })
  }, [checkAvatar, form, locale, watchFile])

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

  useEffect(() => {
    form.setValue("detectedFacesResult", undefined)
  }, [watchFile, form])

  useEffect(() => {
    if (isPending || !watchFile || watchDetectedFacesResult) return

    handleCheckAvatar()
  }, [watchFile, form, isPending, handleCheckAvatar, watchDetectedFacesResult])

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

      // setPaymentStates((prev) => ({
      //   ...prev,
      //   leftTime: 0,
      //   canNavigate: true,
      //   status: ETransactionStatus.EXPIRED,
      // }))
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
        router.push("/management/library-card-holders")
        return
      }

      setPaymentStates((prev) => ({
        ...prev,
        navigateTime,
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentStates.canNavigate, paymentStates.navigateTime, router])

  return (
    <div>
      {!paymentData && (
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{t("Create patron")}</h3>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {!paymentData && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <SelectPackageField form={form} isPending={isPending} />

              <div className="flex gap-4 max-lg:flex-col">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t("Email")}
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
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t("First name")}
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
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t("Last name")}
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
              </div>
              <div className="flex gap-4 max-lg:flex-col">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("Phone")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("Address")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("Date of birth")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={createCalendarDate(field.value)}
                          onChange={(date) =>
                            field.onChange(date ? date.toDate(timezone) : null)
                          }
                          disabled={(date) => date > new Date()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div>
                          {t("Avatar")} (&lt;10MB)
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </div>
                        {field.value ? (
                          <div
                            className={cn(
                              "group relative mt-2 w-fit overflow-hidden rounded-md",
                              isPending && "pointer-events-none opacity-80"
                            )}
                          >
                            <Image
                              src={field.value}
                              alt="imageUrl"
                              width={288}
                              height={288}
                              className="aspect-square max-w-full rounded-md border object-fill group-hover:opacity-90"
                            />
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                field.onChange("")
                                form.setValue(`file`, undefined)
                              }}
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 z-50 hidden group-hover:inline-flex"
                            >
                              <Trash2 className="text-danger" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            {...getRootProps()}
                            className={cn(
                              "mt-2 flex aspect-square w-72 max-w-full cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed transition-colors",
                              isDragActive && "border-primary bg-primary/10",
                              isPending && "pointer-events-none opacity-80"
                            )}
                          >
                            <input {...getInputProps()} />
                            <UploadIcon className="size-12" />
                            <p className="p-4 text-center text-sm">
                              {isDragActive
                                ? t("Drop the image here")
                                : t("Drag & drop or click to upload")}
                            </p>
                          </div>
                        )}
                      </FormLabel>
                      <FormDescription>{t("avatar note")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col">
                  <Label className="mb-1">
                    {t("Check avatar result")}
                    <span className="ml-1 text-xl font-bold leading-none text-transparent">
                      *
                    </span>
                  </Label>
                  {!watchFile && <div>{t("No image uploaded yet")}</div>}
                  {checkingAvatar && (
                    <div className="flex items-center">
                      {t("Checking")}
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 text-sm">
                    {watchFile &&
                      !checkingAvatar &&
                      (watchValidAvatar === undefined ? (
                        <div>{t("Not checked yet")}</div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <strong>{t("Result")}</strong>
                          <div>{t(watchValidAvatar ? "Passed" : "Failed")}</div>
                          <div>
                            {watchValidAvatar ? (
                              <Check className="text-success" />
                            ) : (
                              <X className="text-danger" />
                            )}
                          </div>
                        </div>
                      ))}
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCheckAvatar()
                      }}
                      disabled={isPending || checkingAvatar || !watchFile}
                      size="sm"
                      className="w-fit"
                    >
                      {t("Check")}
                    </Button>
                  </div>
                </div>

                {watchValidAvatar && (
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Gender")}</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              value !== undefined
                                ? parseInt(value, 10)
                                : undefined
                            )
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">{t("Male")}</SelectItem>
                            <SelectItem value="Female">
                              {t("Female")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

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
                    router.push("/management/library-card-holders")
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
          <div className="container mx-auto max-w-5xl p-4">
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
                          "rounded-lg border-2 bg-white p-4",
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

export default CreatePatronForm
