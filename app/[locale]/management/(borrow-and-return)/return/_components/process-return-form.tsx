"use client"

import React, { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { BarcodeIcon, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBorrowRecordStatus, EBorrowType } from "@/lib/types/enums"
import {
  processReturnSchema,
  type TProcessReturnSchema,
} from "@/lib/validations/borrow-records/process-return"
import { processReturn } from "@/actions/borrow-records/process-return"
import useGetPatronActivity, {
  type PatronActivity,
} from "@/hooks/patrons/cards/use-get-patron-activity"
import useGetPatronByBarcode, {
  type ScannedPatron,
} from "@/hooks/patrons/cards/use-get-patron-barcode"
import useBarcodeScanner from "@/hooks/use-barcode-scanner"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PersonalLibraryCard from "@/components/ui/personal-library-card"
import { Switch } from "@/components/ui/switch"

import PatronActivityCard from "../../_components/patron-activity-card"
import ReturnItemFields from "./return-item-fields"

function ProcessReturnForm() {
  const t = useTranslations("BorrowAndReturnManagementPage")

  const locale = useLocale()

  const router = useRouter()

  const [scannedPatron, setScannedPatron] = useState<ScannedPatron | null>(null)
  const [patronActivity, setPatronActivity] = useState<PatronActivity | null>(
    null
  )

  const [isPending, startTransition] = useTransition()

  const form = useForm<TProcessReturnSchema>({
    resolver: zodResolver(processReturnSchema),
    defaultValues: {
      borrowRecordDetails: [],
      isConfirmMissing: false,
      lostBorrowRecordDetails: [],
      isNeedConfirm: false,
    },
  })

  const wLibraryCardBarcode = form.watch("libraryCardBarcode")
  const wLibraryCardId = form.watch("libraryCardId")

  const { mutate: getPatronByBarcode, isPending: fetchingPatron } =
    useGetPatronByBarcode()

  const { mutate: getPatronActivity, isPending: fetchingPatronActivity } =
    useGetPatronActivity()

  const [mode, setMode] = useState<"scan" | "manual">("scan")
  const [barcodeInputValue, setBarcodeInputValue] = useState("")

  const handleBarcodeData = useCallback(
    (scannedData: string) => {
      const scanCard = !wLibraryCardBarcode

      if (scanCard) {
        if (fetchingPatron) return

        getPatronByBarcode(scannedData, {
          onSuccess: (data) => {
            if (!data) {
              toast({
                title: locale === "vi" ? "Lỗi" : "Error",
                description:
                  locale === "vi"
                    ? "Không tìm thấy bạn đọc"
                    : "Not found patron",
                variant: "warning",
              })
              return
            }
            form.setValue("libraryCardBarcode", scannedData)
            form.setValue("libraryCardId", data.libraryCardId)
            setScannedPatron(data)
          },
        })

        return
      }

      const borrowingBarcodes =
        patronActivity?.borrowingItems.map((i) => i.barcode) || []

      if (!borrowingBarcodes.includes(scannedData)) {
        toast({
          title: locale === "vi" ? "Lỗi" : "Error",
          description:
            locale === "vi"
              ? "Tài liệu này không thuộc danh sách trả"
              : "This library item is not in return list",
          variant: "warning",
        })
        return
      }

      setPatronActivity((prev) =>
        prev
          ? {
              ...prev,
              borrowingItems:
                prev?.borrowingItems?.map((item) => {
                  if (item.barcode !== scannedData) return item
                  return {
                    ...item,
                    scanned: true,
                  }
                }) || [],
            }
          : null
      )
    },
    [
      fetchingPatron,
      form,
      getPatronByBarcode,
      locale,
      patronActivity?.borrowingItems,
      wLibraryCardBarcode,
    ]
  )

  useBarcodeScanner(handleBarcodeData, { disabled: mode === "manual" })

  useEffect(() => {
    if (!wLibraryCardId) return

    getPatronActivity(wLibraryCardId, {
      onSuccess: (data) => {
        setPatronActivity(data)
        if (!data) return

        form.setValue(
          "borrowRecordDetails",
          data.borrowingItems.map((item) => ({
            fines: [],
            libraryItemInstanceId: item.instanceId,
            returnConditionId: 1,
            isLost: false,
            scanned: false,
            isOverdue: item.borrowStatus === EBorrowRecordStatus.OVERDUE,
            isInLibrary: item.borrowType === EBorrowType.IN_LIBRARY,
            borrowRecordDetailId: item.borrowRecordDetailId,
          }))
        )
      },
    })
  }, [wLibraryCardId, getPatronActivity, form])

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  const onSubmit = async (values: TProcessReturnSchema) => {
    startTransition(async () => {
      const needConfirmMissing =
        !values.isConfirmMissing &&
        values.borrowRecordDetails.some(
          (record) =>
            (record.isOverdue || record.isInLibrary) &&
            !record.isLost &&
            !record.scanned
        )

      if (needConfirmMissing) {
        form.setValue("isNeedConfirm", true)
        return
      }

      values.borrowRecordDetails = values.borrowRecordDetails
        .map((record) => {
          if (record.isLost) {
            values.lostBorrowRecordDetails.push({
              borrowRecordDetailId: record.borrowRecordDetailId,
              fines: record.fines,
            })
            return false
          }
          if (!record.scanned) return false

          if (record.returnConditionId === 1) record.fines = []
          return record
        })
        // .filter(Boolean) //cách này gọn hơn, nhưng ts lint không hiểu
        .filter((record) => !!record)

      const res = await processReturn(values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })

        if (res.data.returnItemInstanceIds.length === 0) {
          router.push(`/management/borrows/records`)
        } else {
          router.push(
            `/management/return/assign-reservations?${res.data.returnItemInstanceIds.map((id) => `instanceIds=${id}`).join("&")}`
          )
        }
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Return library item")}</h3>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="barcode-mode"
            className={
              mode === "scan" ? "font-medium" : "text-muted-foreground"
            }
          >
            {t("Scan")}
          </Label>
          <Switch
            id="barcode-mode"
            checked={mode === "manual"}
            onCheckedChange={() => {
              setMode((prev) => (prev === "manual" ? "scan" : "manual"))
            }}
          />
          <Label
            htmlFor="barcode-mode"
            className={
              mode === "manual" ? "font-medium" : "text-muted-foreground"
            }
          >
            {t("Manual")}
          </Label>
        </div>
      </div>
      {(!scannedPatron || !patronActivity) &&
        !fetchingPatron &&
        !fetchingPatronActivity &&
        mode === "scan" && (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-primary/50 bg-muted/30 p-8">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <BarcodeIcon className="size-12 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              {t("Scan patrons library card")}
            </h3>
            <p className="mb-4 max-w-md text-center text-muted-foreground">
              {t(
                "Please scan the patrons library card barcode to begin the checkout process"
              )}
            </p>
            <div className="h-1 w-64 animate-pulse bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        )}

      {mode === "manual" && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!barcodeInputValue) return
            handleBarcodeData(barcodeInputValue)
            setBarcodeInputValue("")
          }}
        >
          <div className="mb-6 flex flex-col gap-2">
            <Label>
              {wLibraryCardBarcode
                ? t("Enter items individual registration code")
                : t("Enter patrons library card")}
            </Label>
            <Input
              value={barcodeInputValue}
              onChange={(e) => setBarcodeInputValue(e.target.value)}
              placeholder={
                wLibraryCardBarcode
                  ? locale === "vi"
                    ? "VD: SD00001"
                    : "EX: SD00001"
                  : locale === "vi"
                    ? "VD: EC-D458F3723476"
                    : "EX: EC-D458F3723476"
              }
            />
          </div>
        </form>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {(fetchingPatron || fetchingPatronActivity) && (
            <div className="flex flex-col items-center justify-center rounded-md bg-muted/30 p-6">
              <Loader2 className="mb-2 size-8 animate-spin text-primary" />
              <p className="font-medium text-muted-foreground">
                {t("Loading patron information")}
              </p>
            </div>
          )}

          {scannedPatron && patronActivity && (
            <>
              <div className="flex flex-col gap-y-2">
                <FormLabel className="text-base">
                  {t("Library card")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <div className="flex flex-col gap-4 xl:flex-row">
                  <PersonalLibraryCard
                    cardOnly
                    patron={scannedPatron}
                    cardClassName="w-[512px] max-w-full"
                  />
                  <PatronActivityCard patronActivity={patronActivity} />
                </div>
              </div>

              <FormField
                control={form.control}
                name="borrowRecordDetails"
                render={() => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center gap-4">
                      <FormLabel className="text-base">
                        {t("Return list")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormDescription>
                        {t("Scan items to confirm return list")}
                      </FormDescription>
                      <FormMessage>
                        {
                          form.formState.errors.borrowRecordDetails?.root
                            ?.message
                        }
                      </FormMessage>
                    </div>
                    <FormControl>
                      <ReturnItemFields
                        borrowingItems={patronActivity.borrowingItems}
                        form={form}
                        isPending={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch(`isNeedConfirm`) && (
                <FormField
                  control={form.control}
                  name="isConfirmMissing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t("Confirm missing")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <FormDescription>
                            {t("Confirm missing description")}
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex items-center justify-end gap-4">
                <Button disabled={isPending} variant="outline">
                  {t("Cancel")}
                </Button>
                <Button disabled={isPending} type="submit">
                  {t("Continue")}
                  {isPending && (
                    <Loader2 className="ml-1 size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProcessReturnForm
