"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useDebounce } from "use-debounce"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EStockTransactionType } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  addTrackingDetailSchema,
  type TAddTrackingDetailSchema,
} from "@/lib/validations/trackings/add-tracking-detail"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { addTrackingDetail } from "@/actions/trackings/add-tracking-detail"
import useSearchLibraryItems from "@/hooks/books/use-search-library-items"
import useCategories from "@/hooks/categories/use-categories"
import useConditions from "@/hooks/conditions/use-conditions"
import { toast } from "@/hooks/use-toast"
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CurrencyInput } from "@/components/form/currency-input"

import CatalogDialog from "./catalog-dialog"

type Props = {
  trackingId: number
}

function AddTrackingDetailForm({ trackingId }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const tStockType = useTranslations("Badges.StockTransactionType")
  const locale = useLocale()
  const router = useRouter()

  const [openCatalogDialog, setOpenCatalogDialog] = useState(false)
  const [openComboboxLibraryItem, setOpenComboboxLibraryItem] = useState(false)
  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)
  const [openComboboxCondition, setOpenComboboxCondition] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  const [isPending, startTransition] = useTransition()

  const { data: categoryItems } = useCategories()
  const { data: conditionItems } = useConditions()

  const form = useForm<TAddTrackingDetailSchema>({
    resolver: zodResolver(addTrackingDetailSchema),
    defaultValues: {
      itemName: "",
      conditionId: 1,
      stockTransactionType: EStockTransactionType.NEW,
      isCatalog: false,
    },
  })

  const watchStockType = form.watch(`stockTransactionType`)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const { data: libraryItems, isFetching } = useSearchLibraryItems(
    debouncedSearchTerm,
    watchStockType === EStockTransactionType.ADDITIONAL
  )

  const triggerCatalogs = async () => {
    let flag = true

    if (selectedCategory?.isAllowAITraining && !form.watch(`isbn`)) {
      form.setError(`isbn`, { message: "min1" })
      flag = false
    }

    if (
      watchStockType === EStockTransactionType.ADDITIONAL ||
      form.watch("libraryItem") === undefined
    )
      return flag

    const trigger = await form.trigger(
      [
        `libraryItem.title`,
        `libraryItem.subTitle`,
        `libraryItem.responsibility`,
        `libraryItem.edition`,
        `libraryItem.language`,
        `libraryItem.originLanguage`,
        `libraryItem.summary`,
        `libraryItem.publicationPlace`,
        `libraryItem.publisher`,
        `libraryItem.publicationYear`,
        `libraryItem.classificationNumber`,
        `libraryItem.cutterNumber`,
        `libraryItem.isbn`,
        `libraryItem.ean`,
        `libraryItem.estimatedPrice`,
        `libraryItem.pageCount`,
        `libraryItem.physicalDetails`,
        `libraryItem.dimensions`,
        `libraryItem.accompanyingMaterial`,
        `libraryItem.genres`,
        `libraryItem.generalNote`,
        `libraryItem.bibliographicalNote`,
        `libraryItem.topicalTerms`,
        `libraryItem.additionalAuthors`,
      ],
      { shouldFocus: true }
    )

    const triggerValidImage =
      !form.watch(`libraryItem.file`) || form.watch(`libraryItem.validImage`)

    if (!triggerValidImage) {
      form.setError(`libraryItem.coverImage`, {
        message: "validImageAI",
      })
    }

    const triggerRequireImage =
      !selectedCategory?.isAllowAITraining || form.watch(`libraryItem.file`)

    if (!triggerRequireImage) {
      form.setError(`libraryItem.coverImage`, {
        message: "required",
      })
    }

    const triggerRequireDdc =
      !selectedCategory?.isAllowAITraining ||
      form.watch(`libraryItem.classificationNumber`)

    if (!triggerRequireDdc) {
      form.setError(`libraryItem.classificationNumber`, { message: "required" })
    }

    const triggerRequireCutter =
      !selectedCategory?.isAllowAITraining ||
      form.watch(`libraryItem.cutterNumber`)

    if (!triggerRequireCutter) {
      form.setError(`libraryItem.cutterNumber`, { message: "required" })
    }

    if (
      !trigger ||
      !triggerValidImage ||
      !triggerRequireImage ||
      !triggerRequireDdc ||
      !triggerRequireCutter
    ) {
      form.setError(`itemName`, {
        message: "wrongCatalogInformation",
      })
      flag = false
    }

    return flag
  }

  const onSubmit = async (values: TAddTrackingDetailSchema) => {
    startTransition(async () => {
      const coverImageFile = values.libraryItem?.file

      if (
        coverImageFile &&
        values.libraryItem?.coverImage?.startsWith("blob")
      ) {
        const data = await uploadBookImage(coverImageFile)
        if (!data) {
          toast({
            title: locale === "vi" ? "Thất bại" : "Fail",
            description:
              locale === "vi" ? "Lỗi không xác định" : "Unknown error",
            variant: "danger",
          })
          return
        }
        values.libraryItem.coverImage = data.secureUrl
      }

      if (values.libraryItem?.file) {
        values.libraryItem.file = undefined
      }

      const res = await addTrackingDetail(trackingId, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push(`/management/trackings/${trackingId}`)
        return
      }

      //*Just do this when submit fail
      if (values.libraryItem?.coverImage) {
        form.setValue(`libraryItem.coverImage`, values.libraryItem.coverImage)
      }

      if (res.typeError === "form") {
        const key = Object.keys(res.fieldErrors).find((k) =>
          k.toLowerCase().includes("libraryItem.".toLowerCase())
        )
        if (!key) return

        if (values.libraryItem) {
          form.setError(`itemName`, {
            message: "wrongCatalogInformation",
          })
        }
      }
      handleServerActionError(res, locale, form)
    })
  }

  const watchUnitPrice = form.watch("unitPrice")
  const watchItemTotal = form.watch("itemTotal")

  useEffect(() => {
    const itemTotal = Number(watchItemTotal) || 0
    const unitPrice = Number(watchUnitPrice) || 0

    form.setValue("totalAmount", unitPrice * itemTotal)
  }, [watchUnitPrice, watchItemTotal, form])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <CatalogDialog
            category={selectedCategory}
            form={form}
            isPending={isPending}
            setCategory={setSelectedCategory}
            open={openCatalogDialog}
            setOpen={setOpenCatalogDialog}
          />

          <FormField
            control={form.control}
            name="stockTransactionType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("Stock transaction type")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => field.onChange(+val)}
                    defaultValue={field.value.toString()}
                    className="flex flex-wrap gap-4"
                  >
                    <FormItem className="flex max-w-[500px] flex-1 flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <RadioGroupItem
                          value={EStockTransactionType.NEW.toString()}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {tStockType(EStockTransactionType.NEW.toString())}
                        </FormLabel>
                        <FormDescription>
                          {t("Add new description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                    <FormItem className="flex max-w-[500px] flex-1 flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {tStockType(
                            EStockTransactionType.ADDITIONAL.toString()
                          )}
                        </FormLabel>
                        <FormDescription>
                          {t("Additional description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchStockType === EStockTransactionType.ADDITIONAL ? (
            <FormField
              control={form.control}
              name={`libraryItemId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Library item")}</FormLabel>
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
                            <p className="line-clamp-1">
                              {field.value
                                ? libraryItems?.find(
                                    (item) => item.libraryItemId === field.value
                                  )?.title
                                : t("Select library item")}
                            </p>
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
                                            `libraryItemId`,
                                            item.libraryItemId
                                          )
                                          form.setValue(`itemName`, item.title)
                                          form.setValue(
                                            `unitPrice`,
                                            item.estimatedPrice || 0
                                          )
                                          form.setValue(
                                            `categoryId`,
                                            item.categoryId
                                          )
                                          form.setValue(`isbn`, item.isbn || "")
                                          form.clearErrors(`libraryItemId`)
                                          setOpenComboboxLibraryItem(false)
                                        }}
                                        className={cn(
                                          "line-clamp-1 flex cursor-pointer items-center justify-between gap-4 px-2 py-1 text-sm hover:bg-muted",
                                          item.libraryItemId === field.value &&
                                            "cursor-pointer hover:opacity-100"
                                        )}
                                      >
                                        <p className="line-clamp-1">
                                          {" "}
                                          {item.title}
                                        </p>
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
                                      className="!z-[9999]"
                                      side="right"
                                      asChild
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
                  name={`itemName`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("Item name")}</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center gap-4">
                          <Input
                            disabled={isPending}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              if (form.watch(`libraryItem`)) {
                                form.setValue(
                                  `libraryItem.title`,
                                  e.target.value
                                )
                                form.clearErrors(`libraryItem.title`)
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setOpenCatalogDialog(true)
                            }}
                            className="shrink-0"
                          >
                            {t("Catalog")}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <FormField
            control={form.control}
            name={`isbn`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input
                    disabled={
                      isPending ||
                      watchStockType === EStockTransactionType.ADDITIONAL
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (form.watch(`libraryItem`)) {
                        form.setValue(`libraryItem.isbn`, e.target.value)
                        form.clearErrors(`libraryItem.isbn`)
                      }
                    }}
                  />
                </FormControl>
                {watchStockType === EStockTransactionType.ADDITIONAL && (
                  <FormDescription>
                    {t("Base on selected library item")}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`categoryId`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Category")}</FormLabel>
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
                                form.setValue(`categoryId`, category.categoryId)
                                form.clearErrors(`categoryId`)

                                if (form.watch(`libraryItem`)) {
                                  form.setValue(
                                    `libraryItem.categoryId`,
                                    category.categoryId
                                  )
                                  form.clearErrors(`libraryItem.categoryId`)
                                }

                                setSelectedCategory(category)
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
                {watchStockType === EStockTransactionType.ADDITIONAL && (
                  <FormDescription>
                    {t("Base on selected library item")}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`conditionId`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Condition")}</FormLabel>
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
                                  `conditionId`,
                                  condition.conditionId
                                )
                                form.clearErrors(`conditionId`)
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

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`itemTotal`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Item total")}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    type="number"
                    step="1"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`unitPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Unit price")}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    {...field}
                    disabled={isPending}
                    type="number"
                    onChange={(num) => {
                      field.onChange(num)
                      if (form.watch(`libraryItem`)) {
                        form.setValue(`libraryItem.estimatedPrice`, num)
                        form.clearErrors(`libraryItem.estimatedPrice`)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`totalAmount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Total amount")}</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} disabled type="number" />
                </FormControl>
                <FormDescription>{t("Auto calculated")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/management/trackings/${trackingId}`)
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              disabled={isPending}
              onClick={async (e) => {
                if (!(await triggerCatalogs())) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
            >
              {t("Create")}
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default AddTrackingDetailForm
