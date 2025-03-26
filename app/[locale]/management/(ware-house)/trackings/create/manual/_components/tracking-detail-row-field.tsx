import React, { useEffect, useState } from "react"
import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type FieldArrayWithId, type UseFormReturn } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { EStockTransactionType } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TCreateTrackingManualSchema } from "@/lib/validations/trackings/create-tracking-manual"
import useSearchLibraryItems from "@/hooks/books/use-search-library-items"
import useCategories from "@/hooks/categories/use-categories"
import useConditions from "@/hooks/conditions/use-conditions"
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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import StockTransactionTypeBadge from "@/components/ui/stock-transaction-type-badge"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CurrencyInput } from "@/components/form/currency-input"

import CatalogDialog from "./catalog-dialog"

type Props = {
  index: number
  isPending: boolean
  form: UseFormReturn<TCreateTrackingManualSchema>
  field: FieldArrayWithId<
    TCreateTrackingManualSchema,
    "warehouseTrackingDetails",
    "id"
  >
  onRemove: () => void
  onGlobalCalculate: () => void
  category: Category | null
  setCategory: (val: Category | null) => void
}

function TrackingDetailRowField({
  form,
  index,
  isPending,
  field,
  onRemove,
  onGlobalCalculate,
  category,
  setCategory,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const [openComboboxLibraryItem, setOpenComboboxLibraryItem] = useState(false)
  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)
  const [openComboboxCondition, setOpenComboboxCondition] = useState(false)

  const { data: categoryItems } = useCategories()
  const { data: conditionItems } = useConditions()

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const watchStockType = form.watch(
    `warehouseTrackingDetails.${index}.stockTransactionType`
  )

  const { data: libraryItems, isFetching } = useSearchLibraryItems(
    debouncedSearchTerm,
    watchStockType === EStockTransactionType.ADDITIONAL
  )

  const watchGlobalTotalItem = form.watch("totalItem")

  const watchUnitPrice = form.watch(
    `warehouseTrackingDetails.${index}.unitPrice`
  )

  const watchItemName = form.watch(`warehouseTrackingDetails.${index}.itemName`)

  const watchItemTotal = form.watch(
    `warehouseTrackingDetails.${index}.itemTotal`
  )

  const [openCataloDialog, setOpenCataloDialog] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const itemTotal = Number(watchItemTotal) || 0
      const unitPrice = Number(watchUnitPrice) || 0

      form.setValue(
        `warehouseTrackingDetails.${index}.totalAmount`,
        itemTotal * unitPrice
      )

      onGlobalCalculate()
    }, 500)

    return () => {
      clearTimeout(timer)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUnitPrice, watchItemTotal, form, index])

  useEffect(() => {
    console.log(watchItemName)
  }, [watchItemName])

  return (
    <>
      <CatalogDialog
        category={category}
        form={form}
        index={index}
        isPending={isPending}
        setCategory={setCategory}
        open={openCataloDialog}
        setOpen={setOpenCataloDialog}
      />
      <TableRow key={field.id}>
        <TableCell className="border align-top">
          <div className="mt-2 flex justify-center">
            <StockTransactionTypeBadge type={field.stockTransactionType} />
          </div>
        </TableCell>
        <TableCell className="border align-top">
          {watchStockType === EStockTransactionType.ADDITIONAL ? (
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
                            {watchItemName || t("Select library item")}
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
                                      className="bg-card text-card-foreground"
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
            <>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`warehouseTrackingDetails.${index}.itemName`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          className="w-96 !border-none px-0 !outline-none !ring-0"
                          onChange={(e) => {
                            field.onChange(e)
                            if (
                              form.watch(
                                `warehouseTrackingDetails.${index}.libraryItem`
                              )
                            ) {
                              form.setValue(
                                `warehouseTrackingDetails.${index}.libraryItem.title`,
                                e.target.value
                              )
                              form.clearErrors(
                                `warehouseTrackingDetails.${index}.libraryItem.title`
                              )
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenCataloDialog(true)
                  }}
                  className="mt-1"
                >
                  {t("Catalog")}
                </Button>
              </div>
            </>
          )}
        </TableCell>

        <TableCell className="border align-top">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.isbn`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <Input
                      disabled={
                        isPending ||
                        watchStockType === EStockTransactionType.ADDITIONAL
                      }
                      {...field}
                      className="w-36 !border-none px-0 text-center !outline-none !ring-0"
                      onChange={(e) => {
                        field.onChange(e)
                        if (
                          form.watch(
                            `warehouseTrackingDetails.${index}.libraryItem`
                          )
                        ) {
                          form.setValue(
                            `warehouseTrackingDetails.${index}.libraryItem.isbn`,
                            e.target.value
                          )
                          form.clearErrors(
                            `warehouseTrackingDetails.${index}.libraryItem.isbn`
                          )
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border align-top">
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
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={
                            isPending ||
                            watchStockType === EStockTransactionType.ADDITIONAL
                          }
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
                                  form.setValue(
                                    `warehouseTrackingDetails.${index}.categoryId`,
                                    category.categoryId
                                  )
                                  form.clearErrors(
                                    `warehouseTrackingDetails.${index}.categoryId`
                                  )

                                  if (
                                    form.watch(
                                      `warehouseTrackingDetails.${index}.libraryItem`
                                    )
                                  ) {
                                    form.setValue(
                                      `warehouseTrackingDetails.${index}.libraryItem.categoryId`,
                                      category.categoryId
                                    )
                                    form.clearErrors(
                                      `warehouseTrackingDetails.${index}.libraryItem.categoryId`
                                    )
                                  }

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
        <TableCell className="border align-top">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.conditionId`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <Popover
                    open={openComboboxCondition}
                    onOpenChange={setOpenComboboxCondition}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-40 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? locale === "vi"
                              ? conditionItems?.find(
                                  (condition) =>
                                    condition.conditionId === field.value
                                )?.vietnameseName
                              : conditionItems?.find(
                                  (condition) =>
                                    condition.conditionId === field.value
                                )?.englishName
                            : t("Select condition")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {conditionItems?.map((condition) => (
                              <CommandItem
                                value={
                                  locale === "vi"
                                    ? condition.vietnameseName
                                    : condition.englishName
                                }
                                key={condition.conditionId}
                                onSelect={() => {
                                  form.setValue(
                                    `warehouseTrackingDetails.${index}.conditionId`,
                                    condition.conditionId
                                  )
                                  form.clearErrors(
                                    `warehouseTrackingDetails.${index}.conditionId`
                                  )
                                  setOpenComboboxCondition(false)
                                }}
                              >
                                {locale === "vi"
                                  ? condition.vietnameseName
                                  : condition.englishName}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    condition.conditionId === field.value
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
        <TableCell className="border align-top">
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
                      className="w-28 !border-none px-0 text-center !outline-none !ring-0"
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
        <TableCell className="border align-top">
          <FormField
            control={form.control}
            name={`warehouseTrackingDetails.${index}.unitPrice`}
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full justify-center">
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      disabled={isPending}
                      type="number"
                      className="w-28 !border-none px-0 text-center !outline-none !ring-0"
                      onChange={(num) => {
                        field.onChange(num)
                        if (
                          form.watch(
                            `warehouseTrackingDetails.${index}.libraryItem`
                          )
                        ) {
                          form.setValue(
                            `warehouseTrackingDetails.${index}.libraryItem.estimatedPrice`,
                            num
                          )
                          form.clearErrors(
                            `warehouseTrackingDetails.${index}.libraryItem.estimatedPrice`
                          )
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border align-top">
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
                      className="w-28 !border-none px-0 text-center !outline-none !ring-0"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="border align-top">
          <div className="flex justify-center">
            <Button
              onClick={() => {
                onRemove()
                form.setValue("totalItem", watchGlobalTotalItem - 1)
              }}
              variant="ghost"
              size="icon"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TrackingDetailRowField
