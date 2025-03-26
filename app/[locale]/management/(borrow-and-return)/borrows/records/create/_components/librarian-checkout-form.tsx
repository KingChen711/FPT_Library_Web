"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import {
  ArrowRight,
  BarcodeIcon,
  CalendarIcon,
  Loader2,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyStatus, EBorrowType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  librarianCheckoutSchema,
  type TLibrarianCheckoutSchema,
} from "@/lib/validations/borrow-records/librarian-checkout"
import { createBorrowRecord } from "@/actions/borrow-records/create-record"
import useGetItemByBarcode from "@/hooks/library-items/use-get-item-by-barcode"
import useGetPatronActivity, {
  type PatronActivity,
} from "@/hooks/patrons/cards/use-get-patron-activity"
import useGetPatronByBarcode, {
  type ScannedPatron,
} from "@/hooks/patrons/cards/use-get-patron-barcode"
import useBarcodeScanner from "@/hooks/use-barcode-scanner"
import { toast } from "@/hooks/use-toast"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import LibraryItemCard from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TimePicker } from "@/components/form/time-picker"

function LibrarianCheckoutForm() {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const tBorrowType = useTranslations("Badges.BorrowType")
  const locale = useLocale()
  const formatLocale = useFormatLocale()
  const router = useRouter()

  const [scannedPatron, setScannedPatron] = useState<ScannedPatron | null>(null)
  const [patronActivity, setPatronActivity] = useState<PatronActivity | null>(
    null
  )

  const [isPending, startTransition] = useTransition()

  const form = useForm<TLibrarianCheckoutSchema>({
    resolver: zodResolver(librarianCheckoutSchema),
    defaultValues: {
      borrowRecordDetails: [],
      borrowType: EBorrowType.TAKE_HOME,
      dueDate: new Date(),
    },
  })

  const wLibraryCardBarcode = form.watch("libraryCardBarcode")
  const wLibraryCardId = form.watch("libraryCardId")

  const { mutate: getPatronByBarcode, isPending: fetchingPatron } =
    useGetPatronByBarcode()
  const { mutate: getItemByBarcode } = useGetItemByBarcode()
  const { mutate: getPatronActivity, isPending: fetchingPatronActivity } =
    useGetPatronActivity()

  useBarcodeScanner((scannedData) => {
    const scanCard = !wLibraryCardBarcode

    if (scanCard) {
      if (fetchingPatron) return
      form.setValue("libraryCardBarcode", scannedData)
      getPatronByBarcode(scannedData, {
        onSuccess: (data) => {
          if (!data) {
            toast({
              title: locale === "vi" ? "Lỗi" : "Error",
              description:
                locale === "vi" ? "Không tìm thấy bạn đọc" : "Not found patron",
              variant: "warning",
            })
            return
          }
          form.setValue("libraryCardId", data.libraryCardId)
          setScannedPatron(data)
        },
      })

      return
    }

    getItemByBarcode(scannedData, {
      onSuccess: (data) => {
        if (!data) {
          toast({
            title: locale === "vi" ? "Lỗi" : "Error",
            description:
              locale === "vi"
                ? "Không tìm thấy tài liệu"
                : "Not found library item",
            variant: "warning",
          })
          return
        }

        if (data.status !== EBookCopyStatus.IN_SHELF) {
          toast({
            title: locale === "vi" ? "Lỗi" : "Error",
            description:
              locale === "vi"
                ? "Chỉ có thể mượn tài liệu đang trên kệ"
                : "Only can borrow in-shelf item",
            variant: "warning",
          })
          return
        }

        //check borrowed
        const borrowingItemIds =
          patronActivity?.borrowingItems.map((i) => i.libraryItemId) || []

        if (borrowingItemIds.includes(data.libraryItemId)) {
          toast({
            title: locale === "vi" ? "Lỗi" : "Error",
            description:
              locale === "vi"
                ? "Bạn đọc đã mượn tài liệu này"
                : "Patron has already borrowed this item",
            variant: "warning",
          })
          return
        }

        //check assigned
        const assignedItem = patronActivity?.assignedItems.find(
          (item) => item.libraryItemId === data?.libraryItemId
        )

        const existMatchInstance = assignedItem?.libraryItemInstances?.find(
          (instance) => instance.barcode === scannedData
        )

        if (existMatchInstance) {
          setPatronActivity((prev) =>
            prev
              ? {
                  ...prev,
                  assignedItems:
                    prev?.assignedItems?.map((item) => {
                      if (item.libraryItemId !== data?.libraryItemId)
                        return item
                      return {
                        ...item,
                        scanned: true,
                        barcode: scannedData,
                        instanceId: data.libraryItemInstanceId,
                      }
                    }) || [],
                }
              : null
          )
          return
        } else if (assignedItem && assignedItem.barcode !== scannedData) {
          toast({
            title: locale === "vi" ? "Lỗi" : "Error",
            description:
              locale === "vi"
                ? "Đúng tài liệu nhưng sai bản vật lý đã gán"
                : "Correct library item but wrong physical copy",
            variant: "warning",
          })
          return
        }

        //check requesting
        const requestingItemIds =
          patronActivity?.requestingItems.map((i) => i.libraryItemId) || []

        if (requestingItemIds.includes(data.libraryItemId)) {
          setPatronActivity((prev) =>
            prev
              ? {
                  ...prev,
                  requestingItems:
                    prev?.requestingItems?.map((item) => {
                      if (item.libraryItemId !== data?.libraryItemId)
                        return item
                      return {
                        ...item,
                        scanned: true,
                        barcode: scannedData,
                        instanceId: data.libraryItemInstanceId,
                      }
                    }) || [],
                }
              : null
          )

          return
        }

        //un request item
        setPatronActivity((prev) =>
          prev
            ? {
                ...prev,
                unRequestingItems: prev.unRequestingItems.find(
                  (item) => item.libraryItemId === data.libraryItemId
                )
                  ? prev.unRequestingItems.map((item) => {
                      if (item.libraryItemId === data.libraryItemId) {
                        return {
                          ...item,
                          scanned: true,
                          barcode: scannedData,
                          instanceId: data.libraryItemInstanceId,
                        }
                      }
                      return item
                    })
                  : [
                      ...prev.unRequestingItems,
                      {
                        ...data.libraryItem,
                        scanned: true,
                        barcode: scannedData,
                        instanceId: data.libraryItemInstanceId,
                      },
                    ],
              }
            : null
        )
      },
    })
  })

  useEffect(() => {
    if (!wLibraryCardId) return

    getPatronActivity(wLibraryCardId, {
      onSuccess: (data) => {
        setPatronActivity(data)
      },
    })
  }, [wLibraryCardId, getPatronActivity])

  const onSubmit = async (values: TLibrarianCheckoutSchema) => {
    startTransition(async () => {
      const existUnScannedItem = [
        ...(patronActivity?.requestingItems || []),
        ...(patronActivity?.assignedItems || []),
      ].some((item) => !item.scanned)

      if (existUnScannedItem) {
        form.setError("borrowRecordDetails", { message: "mustScannedAllItems" })
        return
      }

      values.borrowRecordDetails = [
        ...(patronActivity?.requestingItems.map((item) => ({
          libraryItemInstanceId: item.instanceId!,
        })) || []),
        ...(patronActivity?.unRequestingItems.map((item) => ({
          libraryItemInstanceId: item.instanceId!,
        })) || []),
        ...(patronActivity?.assignedItems.map((item) => ({
          libraryItemInstanceId: item.instanceId!,
        })) || []),
      ]

      if (values.borrowRecordDetails.length === 0) {
        form.setError("borrowRecordDetails", { message: "min1" })
        return
      }

      const res = await createBorrowRecord(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push(`/management/borrows/records`)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {(!scannedPatron || !patronActivity) &&
            !fetchingPatron &&
            !fetchingPatronActivity && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-muted/30 p-8">
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
                <Input className="hidden" autoFocus={!wLibraryCardBarcode} />
              </div>
            )}

          {(fetchingPatron || fetchingPatronActivity) && (
            <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 p-6">
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
                <div className="flex flex-col gap-4 md:flex-row">
                  <PersonalLibraryCard
                    cardOnly
                    patron={scannedPatron}
                    cardClassName="max-w-lg"
                  />
                  <div className="flex-1 rounded-lg border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                      <span className="mr-2 inline-block size-2 rounded-full bg-primary"></span>
                      {t("Activity summary")}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t("Borrowing")}
                          </span>
                          <span className="text-lg font-medium">
                            {patronActivity.summaryActivity.totalBorrowing}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-warning"
                            style={{
                              width: `${(patronActivity.summaryActivity.totalBorrowing * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t("Requesting")}
                          </span>
                          <span className="text-lg font-medium">
                            {patronActivity.summaryActivity.totalRequesting}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-info"
                            style={{
                              width: `${(patronActivity.summaryActivity.totalRequesting * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t("Assigned reservations")}
                          </span>
                          <span className="text-lg font-medium">
                            {
                              patronActivity.summaryActivity
                                .totalAssignedReserving
                            }
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-success"
                            style={{
                              width: `${(patronActivity.summaryActivity.totalAssignedReserving * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {t("Pending reservations")}
                            </span>
                            <span className="text-lg font-medium">
                              {
                                patronActivity.summaryActivity
                                  .totalPendingReserving
                              }
                            </span>
                          </div>

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {t("Borrow limit")}
                            </span>
                            <span className="text-lg font-medium">
                              {patronActivity.summaryActivity.totalBorrowOnce}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {t("Remaining")}
                            </span>
                            <span className="text-lg font-medium">
                              {patronActivity.summaryActivity.remainTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("Total activities")}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full bg-warning"></div>
                          <div className="size-3 rounded-full bg-info"></div>
                          <div className="size-3 rounded-full bg-success"></div>
                          <span className="font-semibold">4/3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="borrowType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">
                      {t("Borrow type")}{" "}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value.toString()}
                        className="flex flex-wrap gap-4"
                      >
                        <FormItem className="flex max-w-[500px] flex-1 flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <RadioGroupItem
                              value={EBorrowType.TAKE_HOME.toString()}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {tBorrowType(EBorrowType.TAKE_HOME.toString())}
                            </FormLabel>
                            <FormDescription>
                              {t("Take home description")}
                            </FormDescription>
                          </div>
                        </FormItem>
                        <FormItem className="flex max-w-[500px] flex-1 flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <RadioGroupItem
                              value={EBorrowType.IN_LIBRARY.toString()}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {tBorrowType(EBorrowType.IN_LIBRARY.toString())}
                            </FormLabel>
                            <FormDescription>
                              {t("In library description")}
                            </FormDescription>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("borrowType") === EBorrowType.IN_LIBRARY && (
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        {t("Due date")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Button
                            disabled
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal"
                            )}
                          >
                            <CalendarIcon />
                            {format(new Date(field.value!), "dd MMM yyyy", {
                              locale: formatLocale,
                            })}
                          </Button>
                          <div>-</div>
                          <TimePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="borrowRecordDetails"
                render={({ field: _ }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center gap-4">
                      <FormLabel className="text-base">
                        {t("Borrow list")}{" "}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormDescription>
                        {t("Scan items to confirm borrow list")}
                      </FormDescription>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <div className="flex flex-col space-y-4">
                        {patronActivity &&
                          patronActivity?.unRequestingItems?.length > 0 && (
                            <div className="flex flex-col space-y-3">
                              <div className="mb-1 flex items-center gap-2">
                                <div className="h-6 w-1 rounded-full bg-warning"></div>
                                <Label className="text-lg font-medium">
                                  {t("Un request items")}
                                </Label>
                              </div>
                              <div className="flex flex-col gap-y-4">
                                {patronActivity?.unRequestingItems?.map(
                                  (item) => (
                                    <div
                                      key={item.libraryItemId}
                                      className={cn(
                                        "relative flex items-center gap-6 rounded-lg border bg-card p-4 transition-all",
                                        item.barcode
                                          ? "border-2 border-primary/50 shadow-sm"
                                          : "border-muted"
                                      )}
                                    >
                                      <Button
                                        onClick={() => {
                                          setPatronActivity((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  unRequestingItems:
                                                    prev.unRequestingItems.filter(
                                                      (i) =>
                                                        i.libraryItemId !==
                                                        item.libraryItemId
                                                    ),
                                                }
                                              : null
                                          )
                                        }}
                                        disabled={isPending}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-4"
                                      >
                                        <Trash2 />
                                      </Button>
                                      <LibraryItemCard
                                        libraryItem={item}
                                        expandable
                                      />

                                      <div className="ml-auto flex w-[360px] shrink-0 items-center gap-6">
                                        <div className="flex justify-center">
                                          {item.barcode ? (
                                            <div className="flex flex-col items-center">
                                              <ArrowRight className="size-10 text-primary" />
                                              <span className="mt-1 text-nowrap text-xs font-medium text-primary">
                                                {t("Scanned")}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                                              <div className="size-2 animate-pulse rounded-full bg-warning"></div>
                                              <span className="text-nowrap text-sm font-medium text-muted-foreground">
                                                {t("Not scanned yet")}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        {item.barcode && (
                                          <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                                            <div className="flex flex-col items-center justify-center">
                                              <Barcode
                                                value={item.barcode}
                                                width={2}
                                                height={48}
                                                fontSize={20}
                                                fontOptions="bold"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {patronActivity &&
                          patronActivity?.requestingItems?.length > 0 && (
                            <div className="flex flex-col space-y-3">
                              <div className="mb-1 flex items-center gap-2">
                                <div className="h-6 w-1 rounded-full bg-info"></div>
                                <Label className="text-lg font-medium">
                                  {t("Borrow request items")}
                                </Label>
                              </div>
                              <div className="flex flex-col gap-y-4">
                                {patronActivity?.requestingItems?.map(
                                  (item) => (
                                    <div
                                      key={item.libraryItemId}
                                      className={cn(
                                        "flex items-center gap-6 rounded-lg border bg-card p-4 transition-all",
                                        item.barcode
                                          ? "border-2 border-primary/50 shadow-sm"
                                          : "border-muted"
                                      )}
                                    >
                                      <LibraryItemCard
                                        libraryItem={item}
                                        expandable
                                      />

                                      <div className="ml-auto flex w-[360px] shrink-0 items-center gap-6">
                                        <div className="flex justify-center">
                                          {item.barcode ? (
                                            <div className="flex flex-col items-center">
                                              <ArrowRight className="size-10 text-primary" />
                                              <span className="mt-1 text-nowrap text-xs font-medium text-primary">
                                                {t("Scanned")}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                                              <div className="size-2 animate-pulse rounded-full bg-warning"></div>
                                              <span className="text-nowrap text-sm font-medium text-muted-foreground">
                                                {t("Not scanned yet")}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        {item.barcode && (
                                          <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                                            <div className="flex flex-col items-center justify-center">
                                              <Barcode
                                                value={item.barcode}
                                                width={2}
                                                height={48}
                                                fontSize={20}
                                                fontOptions="bold"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {patronActivity &&
                          patronActivity?.assignedItems?.length > 0 && (
                            <div className="flex flex-col space-y-3">
                              <div className="mb-1 flex items-center gap-2">
                                <div className="h-6 w-1 rounded-full bg-success"></div>
                                <Label className="text-lg font-medium">
                                  {t("Assigned reservation items")}
                                </Label>
                              </div>
                              <div className="flex flex-col gap-y-4">
                                {patronActivity?.assignedItems?.map((item) => (
                                  <div
                                    key={item.libraryItemId}
                                    className={cn(
                                      "flex items-center gap-6 rounded-lg border bg-card p-4 transition-all",
                                      item.scanned
                                        ? "border-2 border-primary/50 shadow-sm"
                                        : "border-muted"
                                    )}
                                  >
                                    <LibraryItemCard
                                      libraryItem={item}
                                      expandable
                                    />

                                    <div className="ml-auto flex w-[360px] shrink-0 items-center gap-6">
                                      <div className="flex justify-center">
                                        {item.scanned ? (
                                          <div className="flex flex-col items-center">
                                            <ArrowRight className="size-10 text-primary" />
                                            <span className="mt-1 text-nowrap text-xs font-medium text-primary">
                                              {t("Scanned")}
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                                            <div className="size-2 animate-pulse rounded-full bg-warning"></div>
                                            <span className="text-nowrap text-sm font-medium text-muted-foreground">
                                              {t("Not scanned yet")}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {item.barcode && (
                                        <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                                          <div className="flex flex-col items-center justify-center">
                                            <Barcode
                                              value={item.barcode}
                                              width={2}
                                              height={48}
                                              fontSize={20}
                                              fontOptions="bold"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
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
    </>
  )
}

export default LibrarianCheckoutForm
