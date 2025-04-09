/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import NoImage from "@/public/assets/images/no-image.png"
import {
  Check,
  ChevronsUpDown,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import {
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFormReturn,
} from "react-hook-form"
import { useDebounce } from "use-debounce"

import { type Category, type StockRecommendedBook } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  ESupplementRequestItemType,
  type TCreateSupplementRequestSchema,
} from "@/lib/validations/supplement/create-supplement-request"
import useLibrarianRecommendBooks from "@/hooks/ai/use-librarian-recommend-books"
import useSearchLibraryItems from "@/hooks/books/use-search-library-items"
import useCategories from "@/hooks/categories/use-categories"
import LibraryItemCard from "@/components/ui/book-card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Rating from "@/components/ui/rating"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SupplementRequestTypeBadge from "@/components/badges/supplement-request-type-badge"
import { CurrencyInput } from "@/components/form/currency-input"

type Props = {
  index: number
  isPending: boolean
  form: UseFormReturn<TCreateSupplementRequestSchema>
  field: FieldArrayWithId<
    TCreateSupplementRequestSchema,
    "warehouseTrackingDetails",
    "id"
  >
  onRemove: () => void
  onGlobalCalculate: () => void
  category: Category | null
  setCategory: (val: Category | null) => void
  wSupplementItemIds: string[]
  recommendAppend: UseFieldArrayAppend<
    TCreateSupplementRequestSchema,
    "supplementRequestDetails"
  >
}

function TrackingDetailRowField({
  form,
  index,
  isPending,
  field,
  onRemove,
  onGlobalCalculate,
  wSupplementItemIds,
  setCategory,
  recommendAppend,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()

  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)

  const [openComboboxLibraryItem, setOpenComboboxLibraryItem] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const watchType = form.watch(`warehouseTrackingDetails.${index}.type`)

  const { data: libraryItems, isFetching } = useSearchLibraryItems(
    debouncedSearchTerm,
    watchType === ESupplementRequestItemType.CUSTOM
  )

  const { data: categoryItems } = useCategories()

  const watchGlobalTotalItem = form.watch("totalItem")

  const watchUnitPrice = form.watch(
    `warehouseTrackingDetails.${index}.unitPrice`
  )

  const wItemName = form.watch(`warehouseTrackingDetails.${index}.itemName`)
  const wLibraryItemId = form.watch(
    `warehouseTrackingDetails.${index}.libraryItemId`
  )

  const watchItemTotal = form.watch(
    `warehouseTrackingDetails.${index}.itemTotal`
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      const itemTotal = Number(watchItemTotal) || 0
      const unitPrice = Number(watchUnitPrice) || 0
      const totalAmount = itemTotal * unitPrice

      form.setValue(
        `warehouseTrackingDetails.${index}.totalAmount`,
        totalAmount
      )

      if (totalAmount > 0)
        form.clearErrors(`warehouseTrackingDetails.${index}.totalAmount`)

      onGlobalCalculate()
    }, 500)

    return () => {
      clearTimeout(timer)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUnitPrice, watchItemTotal, form, index])

  useEffect(() => {
    console.log(wItemName)
  }, [wItemName])

  return (
    <>
      <TableRow key={field.id}>
        <TableCell className="text-nowrap border">
          <div className="flex justify-center">
            <SupplementRequestTypeBadge status={field.type} />
          </div>
        </TableCell>

        <TableCell className="border">
          {watchType === ESupplementRequestItemType.CUSTOM ? (
            <FormField
              control={form.control}
              name={`warehouseTrackingDetails.${index}.libraryItemId`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full justify-start">
                    <Popover
                      open={openComboboxLibraryItem}
                      onOpenChange={setOpenComboboxLibraryItem}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "line-clamp-1 flex max-w-96 justify-start text-nowrap",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {wItemName || t("Select library item")}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent side="top" className="max-w-96 p-0">
                        <Command>
                          <CommandInput
                            value={searchTerm}
                            onValueChange={(val) => setSearchTerm(val)}
                            placeholder={t("Search library item")}
                            className="h-9"
                          />
                          <CommandList>
                            {debouncedSearchTerm &&
                              !isFetching &&
                              libraryItems?.length === 0 && (
                                <CommandEmpty>
                                  {t("No item found")}
                                </CommandEmpty>
                              )}
                            <div className="line-clamp-1 flex w-full flex-col text-nowrap">
                              {isFetching && (
                                <div className="flex justify-center px-2 py-1">
                                  <Loader2 className="size-9" />
                                </div>
                              )}
                              {libraryItems?.map((item) => (
                                <TooltipProvider key={item.libraryItemId}>
                                  <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                      <div
                                        onClick={() => {
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.libraryItemId`,
                                            item.libraryItemId
                                          )
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.itemName`,
                                            item.title
                                          )
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.unitPrice`,
                                            item.estimatedPrice || 0
                                          )
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.hasInitPrice`,
                                            !!item.estimatedPrice
                                          )
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.categoryId`,
                                            item.categoryId
                                          )
                                          form.setValue(
                                            `warehouseTrackingDetails.${index}.isbn`,
                                            item.isbn || ""
                                          )
                                          form.clearErrors(
                                            `warehouseTrackingDetails.${index}.libraryItemId`
                                          )
                                          setOpenComboboxLibraryItem(false)
                                        }}
                                        className={cn(
                                          "line-clamp-1 flex cursor-pointer items-center justify-between gap-4 px-2 py-1 text-sm hover:bg-muted",
                                          item.libraryItemId === field.value &&
                                            "cursor-pointer hover:opacity-100"
                                        )}
                                      >
                                        {item.title}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            item.libraryItemId === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="right"
                                      asChild
                                      className="m-0 bg-card p-0 text-card-foreground"
                                    >
                                      <LibraryItemCard libraryItem={item} />
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name={`warehouseTrackingDetails.${index}.itemName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        className="w-72 !border-none px-0 !shadow-none !outline-none !ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </TableCell>

        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.isbn`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className="w-36 !border-none px-0 text-center !shadow-none !outline-none !ring-0"
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.categoryId`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <Popover
                    open={openComboboxCategory}
                    onOpenChange={setOpenComboboxCategory}
                  >
                    <PopoverTrigger asChild disabled>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled
                        >
                          {field.value
                            ? locale === "vi"
                              ? categoryItems?.find(
                                  (category) =>
                                    category.categoryId === field.value
                                )?.vietnameseName
                              : categoryItems?.find(
                                  (category) =>
                                    category.categoryId === field.value
                                )?.englishName
                            : t("Select category")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t("Search category")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("No category found")}</CommandEmpty>
                          <CommandGroup>
                            {categoryItems?.map((category) => (
                              <CommandItem
                                value={
                                  locale === "vi"
                                    ? category.vietnameseName
                                    : category.englishName
                                }
                                key={category.categoryId}
                                onSelect={() => {
                                  field.onChange(category.categoryId)
                                  setCategory(category)
                                  setOpenComboboxCategory(false)
                                }}
                              >
                                {locale === "vi"
                                  ? category.vietnameseName
                                  : category.englishName}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    category.categoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.itemTotal`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      className="w-28 !border-none px-0 text-center !shadow-none !outline-none !ring-0"
                      type="number"
                      step="1"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.unitPrice`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      disabled={
                        isPending ||
                        form.watch(
                          `warehouseTrackingDetails.${index}.hasInitPrice`
                        )
                      }
                      type="number"
                      className="w-28 !border-none px-0 text-center !shadow-none !outline-none !ring-0"
                      onChange={(num) => field.onChange(num)}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.totalAmount`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      disabled
                      type="number"
                      className="w-28 !border-none px-0 text-center !shadow-none !outline-none !ring-0"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        <TableCell className="border">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.supplementRequestReason`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      className="w-full min-w-60 !border-none px-0 !shadow-none !outline-none !ring-0"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        <TableCell className="border">
          <ItemRowDropdown
            onSelect={(val) => {
              recommendAppend({
                author: val.author,
                //@ts-ignore
                averageRating: val.averageRating,
                id: val.id,
                pageCount: val.pageCount || 0,
                publisher: val.publisher,
                //@ts-ignore
                ratingsCount: val.ratingsCount || 0,
                relatedLibraryItemId: val.relatedLibraryItemId,
                title: val.title,
                categories: val.categories,
                coverImageLink: val.coverImageLink,
                description: val.description,
                dimensions: val.dimensions,
                estimatedPrice: val.estimatedPrice,
                infoLink: val.infoLink,
                isbn: val.isbn,
                language: val.language,
                previewLink: val.previewLink,
                publishedDate: val.publishedDate,
                supplementRequestReason: "",
              })
            }}
            wSupplementItemIds={wSupplementItemIds}
            title={wItemName}
            libraryItemId={wLibraryItemId}
            onDelete={() => {
              onRemove()
              form.setValue("totalItem", watchGlobalTotalItem - 1)
            }}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

export default TrackingDetailRowField

type ItemRowDropdownProps = {
  wSupplementItemIds: string[]
  onDelete: () => void
  libraryItemId: number | undefined
  title: string | undefined
  onSelect: (val: StockRecommendedBook) => void
}

function ItemRowDropdown({
  onDelete,
  libraryItemId,
  title,
  wSupplementItemIds,
  onSelect,
}: ItemRowDropdownProps) {
  const t = useTranslations("TrackingsManagementPage")
  const [openRecommend, setOpenRecommend] = useState(false)

  const { data, isLoading, refetch, isRefetching } = useLibrarianRecommendBooks(
    {
      enabled: openRecommend,
      relatedLibraryItemId: libraryItemId,
      relatedTitle: title,
    }
  )

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  return (
    <>
      <Dialog open={openRecommend} onOpenChange={setOpenRecommend}>
        <DialogContent
          className={cn(
            "max-h-[80vh] overflow-y-auto",
            !isLoading && "max-w-7xl"
          )}
        >
          <DialogHeader>
            <DialogDescription asChild>
              <div className="pt-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xl font-bold">
                    {t("Recommend items")}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      disabled={isLoading || isRefetching}
                      variant="outline"
                      onClick={() => refetch()}
                    >
                      {isRefetching ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        <Icons.Wand className="size-4" />
                      )}
                      {t("Try again")}
                    </Button>
                  </div>
                </div>
                {isLoading && (
                  <div className="my-10 flex w-full justify-center">
                    <Loader2 className="size-9 animate-spin" />
                  </div>
                )}
                <div className="mt-4 grid w-full">
                  {data && data.length > 0 && (
                    <div className="overflow-x-auto rounded-md border">
                      <Table className="overflow-hidden">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-nowrap font-bold">
                              {t("Title")}
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              {t("Authors")}
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              {t("Publisher")}
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Published date")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("ISBN")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Page count")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Dimension")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Estimated price")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Language")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Categories")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Average rating")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Ratings count")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Description")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Preview link")}
                              </div>
                            </TableHead>

                            <TableHead className="text-nowrap font-bold">
                              <div className="flex justify-center">
                                {t("Info link")}
                              </div>
                            </TableHead>

                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data
                            ?.slice(
                              (pageIndex - 1) * +pageSize,
                              (pageIndex - 1) * +pageSize + +pageSize
                            )
                            ?.map((source) => (
                              <TableRow key={source.id}>
                                <TableCell className="text-nowrap font-bold">
                                  <div className="group flex items-center gap-2 pr-8">
                                    {source.coverImageLink ? (
                                      <Image
                                        alt={source.title}
                                        src={source.coverImageLink}
                                        width={40}
                                        height={60}
                                        className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                                      />
                                    ) : (
                                      <Image
                                        alt={source.title}
                                        src={NoImage}
                                        width={40}
                                        height={60}
                                        className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                                      />
                                    )}
                                    <p className="font-bold group-hover:underline">
                                      {source.title || "-"}
                                    </p>
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  {source.author || "-"}
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  {source.publisher || "-"}
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.publishedDate || "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.isbn || "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.pageCount ?? "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.dimensions || "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.estimatedPrice ?? "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.language || "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.categories || "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    <Rating value={source.averageRating} />
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.ratingsCount ?? "-"}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.description ? (
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            {t("View content")}
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto overflow-x-hidden">
                                          <DialogHeader>
                                            <DialogTitle>
                                              {t("Description")}
                                            </DialogTitle>
                                            <DialogDescription>
                                              <ParseHtml
                                                data={source.description}
                                              />
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
                                    {source.previewLink ? (
                                      <Button asChild variant="link">
                                        <Link
                                          target="_blank"
                                          href={source.previewLink}
                                        >
                                          {t("Open link")}
                                        </Link>
                                      </Button>
                                    ) : (
                                      "-"
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {source.infoLink ? (
                                      <Button asChild variant="link">
                                        <Link
                                          target="_blank"
                                          href={source.infoLink}
                                        >
                                          {t("Open link")}
                                        </Link>
                                      </Button>
                                    ) : (
                                      "-"
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="text-nowrap">
                                  <div className="flex justify-center">
                                    {wSupplementItemIds.includes(source.id) ? (
                                      <Button disabled>{t("Selected")}</Button>
                                    ) : (
                                      <Button onClick={() => onSelect(source)}>
                                        {t("Select")}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {data?.length === 0 && (
                    <div className="flex justify-center p-4">
                      <NoData />
                    </div>
                  )}
                  {data && (
                    <Paginator
                      pageSize={+pageSize}
                      pageIndex={pageIndex}
                      totalPage={Math.ceil(data.length / +pageSize)}
                      totalActualItem={data.length}
                      className="mt-6"
                      onPaginate={handlePaginate}
                      onChangePageSize={handleChangePageSize}
                    />
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {libraryItemId && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenRecommend(true)}
            >
              <Icons.Wand className="size-4" />
              {t("Recommend")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
            <Trash2 className="size-4" />
            {t("Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
