"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EStockTransactionType } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  createTrackingManualSchema,
  type TCreateTrackingManualSchema,
} from "@/lib/validations/trackings/create-tracking-manual"
import { createTrackingManual } from "@/actions/trackings/create-tracking-manual"
import useCategories from "@/hooks/categories/use-categories"
import useUploadImage from "@/hooks/media/use-upload-image"
import useSuppliers from "@/hooks/suppliers/use-suppliers"
import { toast } from "@/hooks/use-toast"
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
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

import TrackingDetailsField from "./tracking-details-field"

function CreateTrackingManualForm() {
  const timezone = getLocalTimeZone()
  const t = useTranslations("TrackingsManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const [openComboboxSupplier, setOpenComboboxSupplier] = useState(false)
  const { data: supplierItems } = useSuppliers()
  const { data: categoryItems } = useCategories()
  const form = useForm<TCreateTrackingManualSchema>({
    resolver: zodResolver(createTrackingManualSchema),
    defaultValues: {
      totalAmount: 0,
      totalItem: 0,
      warehouseTrackingDetails: [],
    },
  })

  const { mutateAsync: uploadBookImage } = useUploadImage()

  const onSubmit = async (values: TCreateTrackingManualSchema) => {
    startTransition(async () => {
      const coverImageFiles = values.warehouseTrackingDetails.map(
        (a) => a.libraryItem?.file || null
      )

      const uploadImagePromises = coverImageFiles.map(async (file, index) => {
        if (
          file &&
          values.warehouseTrackingDetails[
            index
          ].libraryItem?.coverImage?.startsWith("blob")
        ) {
          const data = await uploadBookImage(file)
          if (!data) {
            toast({
              title: locale === "vi" ? "Thất bại" : "Fail",
              description:
                locale === "vi" ? "Lỗi không xác định" : "Unknown error",
              variant: "danger",
            })
            return
          }
          values.warehouseTrackingDetails[index].libraryItem.coverImage =
            data.secureUrl
        }
      })

      await Promise.all(uploadImagePromises)

      values.warehouseTrackingDetails.forEach((d) => {
        if (d.libraryItem) {
          d.libraryItem.file = undefined
        }
      })

      console.log(values)

      const res = await createTrackingManual(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push("/management/trackings")
        return
      }

      //*Just do this when submit fail
      values.warehouseTrackingDetails.forEach((d, i) => {
        if (d.libraryItem?.coverImage) {
          form.setValue(
            `warehouseTrackingDetails.${i}.libraryItem.coverImage`,
            d.libraryItem?.coverImage
          )
        }
      })

      if (res.typeError === "form") {
        const key = Object.keys(res.fieldErrors)
          .filter((k) =>
            k
              .toLowerCase()
              .startsWith("warehouseTrackingDetails[".toLowerCase())
          )
          .map((k) => k.replace("warehouseTrackingDetails[", ""))
          .find((k) => k.includes("libraryItem.".toLowerCase()))

        if (key) {
          const index = +key[0]

          if (
            Number(index) &&
            values.warehouseTrackingDetails[index].libraryItem
          ) {
            form.setError(
              `warehouseTrackingDetails.${index}.itemName`,
              {
                message: "wrongCatalogInformation",
              },
              { shouldFocus: true }
            )
          }
        }
      }

      handleServerActionError(res, locale, form)
    })
  }

  const [selectedCategories, setSelectedCategories] = useState<
    (Category | null)[]
  >([])

  const triggerCatalogs = async () => {
    let flag = true
    const rows = form.watch("warehouseTrackingDetails")

    const triggerGlobal = await form.trigger([
      "supplierId",
      "description",
      "entryDate",
      "totalAmount",
      "totalItem",
    ])

    flag = triggerGlobal

    for (let i = 0; i < rows.length; ++i) {
      const row = rows[i]

      const selectedCategory =
        selectedCategories[i] ||
        (row.categoryId
          ? categoryItems?.find((c) => c.categoryId === row.categoryId)
          : null)

      //TODO(isNotBook)
      const isNotBook =
        selectedCategory?.englishName === "Magazine" ||
        selectedCategory?.englishName === "Newspaper" ||
        selectedCategory?.englishName === "Other" ||
        false

      if (!isNotBook && !form.watch(`warehouseTrackingDetails.${i}.isbn`)) {
        form.setError(
          `warehouseTrackingDetails.${i}.isbn`,
          { message: "min1" },
          { shouldFocus: true }
        )
        flag = false
      }

      if (
        row.stockTransactionType === EStockTransactionType.ADDITIONAL ||
        row.libraryItem === undefined ||
        row.libraryItem.categoryId === undefined
      ) {
        form.setValue(`warehouseTrackingDetails.${i}.libraryItem`, undefined)
        continue
      }

      const trigger = await form.trigger(
        [
          `warehouseTrackingDetails.${i}.libraryItem.title`,
          `warehouseTrackingDetails.${i}.libraryItem.subTitle`,
          `warehouseTrackingDetails.${i}.libraryItem.responsibility`,
          `warehouseTrackingDetails.${i}.libraryItem.edition`,
          `warehouseTrackingDetails.${i}.libraryItem.language`,
          `warehouseTrackingDetails.${i}.libraryItem.originLanguage`,
          `warehouseTrackingDetails.${i}.libraryItem.summary`,
          `warehouseTrackingDetails.${i}.libraryItem.publicationPlace`,
          `warehouseTrackingDetails.${i}.libraryItem.publisher`,
          `warehouseTrackingDetails.${i}.libraryItem.publicationYear`,
          `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`,
          `warehouseTrackingDetails.${i}.libraryItem.cutterNumber`,
          `warehouseTrackingDetails.${i}.libraryItem.isbn`,
          `warehouseTrackingDetails.${i}.libraryItem.ean`,
          `warehouseTrackingDetails.${i}.libraryItem.estimatedPrice`,
          `warehouseTrackingDetails.${i}.libraryItem.pageCount`,
          `warehouseTrackingDetails.${i}.libraryItem.physicalDetails`,
          `warehouseTrackingDetails.${i}.libraryItem.dimensions`,
          `warehouseTrackingDetails.${i}.libraryItem.accompanyingMaterial`,
          `warehouseTrackingDetails.${i}.libraryItem.genres`,
          `warehouseTrackingDetails.${i}.libraryItem.generalNote`,
          `warehouseTrackingDetails.${i}.libraryItem.bibliographicalNote`,
          `warehouseTrackingDetails.${i}.libraryItem.topicalTerms`,
          `warehouseTrackingDetails.${i}.libraryItem.additionalAuthors`,
        ],
        { shouldFocus: true }
      )

      const triggerValidImage =
        !form.watch(`warehouseTrackingDetails.${i}.libraryItem.file`) ||
        form.watch(`warehouseTrackingDetails.${i}.libraryItem.validImage`)

      if (!triggerValidImage) {
        form.setError(
          `warehouseTrackingDetails.${i}.libraryItem.coverImage`,
          {
            message: "validImageAI",
          },
          { shouldFocus: true }
        )
      }

      const triggerRequireImage =
        isNotBook ||
        form.watch(`warehouseTrackingDetails.${i}.libraryItem.file`)

      if (!triggerRequireImage) {
        form.setError(
          `warehouseTrackingDetails.${i}.libraryItem.coverImage`,
          {
            message: "required",
          },
          { shouldFocus: true }
        )
      }

      const triggerRequireDdc = form.watch(
        `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`
      )

      if (!triggerRequireDdc) {
        form.setError(
          `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`,
          { message: "required" },
          { shouldFocus: true }
        )
      }

      const triggerRequireCutter = form.watch(
        `warehouseTrackingDetails.${i}.libraryItem.cutterNumber`
      )

      if (!triggerRequireCutter) {
        form.setError(
          `warehouseTrackingDetails.${i}.libraryItem.cutterNumber`,
          { message: "required" },
          { shouldFocus: true }
        )
      }

      if (
        !trigger ||
        !triggerValidImage ||
        !triggerRequireImage ||
        !triggerRequireDdc ||
        !triggerRequireCutter
      ) {
        form.setError(
          `warehouseTrackingDetails.${i}.itemName`,
          {
            message: "wrongCatalogInformation",
          },
          { shouldFocus: true }
        )
        flag = false
      }
    }
    return flag
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>
                  {t("Supplier")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <Popover
                  open={openComboboxSupplier}
                  onOpenChange={setOpenComboboxSupplier}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? supplierItems?.find(
                              (supplier) => supplier.supplierId === field.value
                            )?.supplierName
                          : t("Select supplier")}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder={t("Search supplier")}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{t("No supplier found")}</CommandEmpty>
                        <CommandGroup>
                          {supplierItems?.map((supplier) => (
                            <CommandItem
                              value={supplier.supplierName}
                              key={supplier.supplierId}
                              onSelect={() => {
                                form.setValue("supplierId", supplier.supplierId)
                                setOpenComboboxSupplier(false)
                              }}
                            >
                              {supplier.supplierName}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  supplier.supplierId === field.value
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
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>
                  {t("Entry date")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={createCalendarDate(field.value)}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate(timezone) : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="totalItem"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("Total item")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled type="number" step="1" />
                </FormControl>
                <FormDescription>{t("Auto calculated")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("Total amount")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <CurrencyInput {...field} disabled type="number" />
                </FormControl>
                <FormDescription>{t("Auto calculated")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TrackingDetailsField
          form={form}
          isPending={isPending}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push("/management/trackings")
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
  )
}

export default CreateTrackingManualForm
