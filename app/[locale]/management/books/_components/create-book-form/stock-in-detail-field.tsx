import React, { useEffect, useState } from "react"
import { ArrowRight, Loader2, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { cn, formatPrice } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import useSearchTrackings from "@/hooks/trackings/use-search-trackings"
import useTrackingDetailsNoItem from "@/hooks/trackings/use-tracking-detaills-no-item"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { TrackingCard } from "./tracking-card"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
}

function StockInDetailField({ form, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")

  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const [searchTermDetail, setSearchTermDetail] = useState("")
  const [debouncedSearchTermDetail] = useDebounce(searchTermDetail, 300)

  const selectedTracking = form.watch("tracking")
  const trackingDetail = form.watch("trackingDetail")

  const { data: trackingItems, isFetching } =
    useSearchTrackings(debouncedSearchTerm)

  const { data: trackingDetailItems, isFetching: isFetchingDetails } =
    useTrackingDetailsNoItem(
      selectedTracking?.trackingId,
      debouncedSearchTermDetail
    )

  useEffect(() => {
    if (trackingDetail?.isbn) {
      form.setValue("isbn", trackingDetail?.isbn)
    }
    if (trackingDetail?.unitPrice) {
      form.setValue("estimatedPrice", trackingDetail?.unitPrice)
    }
    if (trackingDetail?.categoryId) {
      form.setValue("categoryId", trackingDetail?.categoryId)
    }
  }, [trackingDetail, form])

  useEffect(() => {
    if (!trackingDetailItems || trackingDetailItems.length === 0) return

    const isbn = form.watch("isbn")
    const td = trackingDetailItems.find((td) => {
      return (
        td.isbn &&
        isbn &&
        td.isbn.replaceAll("-", "") === isbn.replaceAll("-", "")
      )
    })

    if (!td) return

    form.setValue("trackingDetailId", td.trackingDetailId)
    form.setValue("trackingDetail", td)
    form.clearErrors("trackingDetailId")
  }, [trackingDetailItems, form])

  useEffect(() => {
    if (!trackingDetail?.unitPrice) return
    form.setValue("estimatedPrice", trackingDetail.unitPrice as number)
  }, [trackingDetail, form])

  return (
    <FormField
      control={form.control}
      name="trackingDetailId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {t("Stock in detail")}
            <span className="ml-1 text-xl font-bold leading-none text-primary">
              *
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    {t("Stock in detail")}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="flex flex-col space-y-6">
                      <div className="flex flex-col gap-2">
                        <Label>{t("Stock in tracking")}</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={isPending}
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "w-72 justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {t("Select tracking")}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command className="w-72">
                              <CommandInput
                                placeholder={t("Search")}
                                className="h-9"
                                value={searchTerm}
                                onValueChange={(val) => setSearchTerm(val)}
                              />
                              <CommandList>
                                {searchTermDetail !== "" &&
                                  searchTermDetail ===
                                    debouncedSearchTermDetail &&
                                  !isFetching &&
                                  trackingItems?.length === 0 && (
                                    <CommandEmpty>
                                      {t("No tracking found")}
                                    </CommandEmpty>
                                  )}
                                <CommandGroup>
                                  {isFetching && (
                                    <CommandItem className="flex justify-center">
                                      <Loader2 className="size-4 animate-spin" />
                                    </CommandItem>
                                  )}
                                </CommandGroup>
                              </CommandList>

                              <div className="flex max-h-[400px] w-full flex-col overflow-y-auto overflow-x-hidden">
                                {trackingItems?.map((tracking) => (
                                  <TrackingCard
                                    key={tracking.trackingId}
                                    className="rounded-none"
                                    tracking={tracking}
                                    onClick={() => {
                                      form.setValue(`tracking`, tracking)
                                      setOpen(false)
                                      setSearchTerm("")
                                    }}
                                  />
                                ))}
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedTracking && (
                          <TrackingCard tracking={selectedTracking} />
                        )}
                      </div>

                      {selectedTracking && (
                        <div className="flex flex-col gap-2">
                          <Label>{t("Tracking details")}</Label>

                          <Popover
                            open={openDetail}
                            onOpenChange={setOpenDetail}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled={isPending}
                                  variant="ghost"
                                  role="combobox"
                                  className={cn(
                                    "w-72 justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {t("Select tracking")}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command className="w-72">
                                <CommandInput
                                  placeholder={t("Search")}
                                  className="h-9"
                                  value={searchTermDetail}
                                  onValueChange={(val) =>
                                    setSearchTermDetail(val)
                                  }
                                />
                                <CommandList>
                                  {searchTermDetail !== "" &&
                                    searchTermDetail ===
                                      debouncedSearchTermDetail &&
                                    !isFetchingDetails &&
                                    trackingDetailItems?.length === 0 && (
                                      <CommandEmpty>
                                        {t("No tracking found")}
                                      </CommandEmpty>
                                    )}
                                  <CommandGroup>
                                    {isFetchingDetails && (
                                      <CommandItem className="flex justify-center">
                                        <Loader2 className="size-4 animate-spin" />
                                      </CommandItem>
                                    )}
                                  </CommandGroup>
                                </CommandList>

                                <div className="flex max-h-[400px] w-full flex-col overflow-y-auto overflow-x-hidden">
                                  {trackingDetailItems?.map((detail) => (
                                    <div
                                      key={detail.trackingDetailId}
                                      className={cn(
                                        "grid w-72 max-w-72 cursor-pointer border p-4",
                                        field.value ===
                                          detail.trackingDetailId &&
                                          "border-primary"
                                      )}
                                      onClick={() => {
                                        field.onChange(detail.trackingDetailId)
                                        form.setValue("trackingDetail", detail)
                                        form.clearErrors("trackingDetailId")
                                        setOpenDetail(false)
                                      }}
                                    >
                                      <div className="flex justify-between gap-2">
                                        <span className="text-nowrap text-sm font-medium text-muted-foreground">
                                          {t("Item name")}:
                                        </span>
                                        <span className="line-clamp-1 text-sm font-bold">
                                          {detail.itemName}
                                        </span>
                                      </div>
                                      <div className="flex justify-between gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                          ISBN:
                                        </span>
                                        <span className="line-clamp-1 text-sm">
                                          {detail.isbn || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between gap-2">
                                        <span className="text-sm text-muted-foreground">
                                          {t("Total item")}:
                                        </span>
                                        <span className="line-clamp-1 text-sm">
                                          {detail.itemTotal}
                                        </span>
                                      </div>
                                      <div className="flex justify-between gap-2">
                                        <span className="text-sm text-muted-foreground">
                                          {t("Total amount")}:
                                        </span>
                                        <span className="line-clamp-1 text-sm">
                                          {formatPrice(detail.totalAmount)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {trackingDetail && (
                            <div
                              className={cn(
                                "grid max-w-72 cursor-pointer rounded-md border p-4"
                              )}
                            >
                              <div className="flex justify-between gap-2">
                                <span className="text-nowrap text-sm font-medium text-muted-foreground">
                                  {t("Item name")}:
                                </span>
                                <span className="line-clamp-1 text-sm font-bold">
                                  {trackingDetail.itemName}
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                  ISBN:
                                </span>
                                <span className="line-clamp-1 text-sm">
                                  {trackingDetail.isbn || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {t("Total item")}:
                                </span>
                                <span className="line-clamp-1 text-sm">
                                  {trackingDetail.itemTotal}
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {t("Total amount")}:
                                </span>
                                <span className="line-clamp-1 text-sm">
                                  {formatPrice(trackingDetail.totalAmount)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </FormLabel>
          <div>
            {!selectedTracking && (
              <p className="text-sm text-muted-foreground">
                {t("No stock in detail selected")}
              </p>
            )}

            <div className="flex items-center gap-4">
              {selectedTracking && <TrackingCard tracking={selectedTracking} />}
              {selectedTracking && trackingDetail && (
                <>
                  <ArrowRight className="size-9" />
                  <div className="grid w-72 max-w-72 rounded-md border p-4">
                    <div className="flex justify-between gap-2">
                      <span className="text-nowrap text-sm font-medium text-muted-foreground">
                        {t("Item name")}:
                      </span>
                      <span className="line-clamp-1 text-sm font-bold">
                        {trackingDetail.itemName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        ISBN:
                      </span>
                      <span className="line-clamp-1 text-sm">
                        {trackingDetail.isbn || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("Total item")}:
                      </span>
                      <span className="line-clamp-1 text-sm">
                        {trackingDetail.itemTotal}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("Total amount")}:
                      </span>
                      <span className="line-clamp-1 text-sm">
                        {formatPrice(trackingDetail.totalAmount)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <FormDescription>
            {t("Click pencil button to change stock in detail")}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default StockInDetailField
