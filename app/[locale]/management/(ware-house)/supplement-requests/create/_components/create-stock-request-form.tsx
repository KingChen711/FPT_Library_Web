// "use client"

// import React, { useEffect, useState, useTransition } from "react"
// import { useRouter } from "@/i18n/routing"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { getLocalTimeZone } from "@internationalized/date"
// import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
// import { useLocale, useTranslations } from "next-intl"
// import { useForm } from "react-hook-form"

// import handleServerActionError from "@/lib/handle-server-action-error"
// import { EStockTransactionType } from "@/lib/types/enums"
// import { type Category } from "@/lib/types/models"
// import { cn } from "@/lib/utils"
// import {
//   createSupplementRequestSchema,
//   type TCreateSupplementRequestSchema,
// } from "@/lib/validations/supplement/create-supplement-request"
// import useCategories from "@/hooks/categories/use-categories"
// import useSuppliers from "@/hooks/suppliers/use-suppliers"
// import { toast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Textarea } from "@/components/ui/textarea"
// import { CurrencyInput } from "@/components/form/currency-input"
// import {
//   createCalendarDate,
//   DateTimePicker,
// } from "@/components/form/date-time-picker"

// function CreateStockRequestForm() {
//   const timezone = getLocalTimeZone()
//   const t = useTranslations("TrackingsManagementPage")
//   const router = useRouter()
//   const locale = useLocale()
//   const [isPending, startTransition] = useTransition()

//   const [openComboboxSupplier, setOpenComboboxSupplier] = useState(false)
//   const { data: supplierItems } = useSuppliers()
//   const { data: categoryItems } = useCategories()
//   const form = useForm<TCreateSupplementRequestSchema>({
//     resolver: zodResolver(createSupplementRequestSchema),
//     defaultValues: {
//       totalAmount: 0,
//       totalItem: 0,
//       warehouseTrackingDetails: [],
//       supplementRequestDetails: [],
//     },
//   })

//   const onSubmit = async (values: TCreateSupplementRequestSchema) => {
//     // startTransition(async () => {
//     //   const coverImageFiles = values.warehouseTrackingDetails.map(
//     //     (a) => a.libraryItem?.file || null
//     //   )
//     //   const uploadImagePromises = coverImageFiles.map(async (file, index) => {
//     //     if (
//     //       file &&
//     //       values.warehouseTrackingDetails[
//     //         index
//     //       ].libraryItem?.coverImage?.startsWith("blob")
//     //     ) {
//     //       const data = await uploadBookImage(file)
//     //       if (!data) {
//     //         toast({
//     //           title: locale === "vi" ? "Thất bại" : "Fail",
//     //           description:
//     //             locale === "vi" ? "Lỗi không xác định" : "Unknown error",
//     //           variant: "danger",
//     //         })
//     //         return
//     //       }
//     //       values.warehouseTrackingDetails[index].libraryItem.coverImage =
//     //         data.secureUrl
//     //     }
//     //   })
//     //   await Promise.all(uploadImagePromises)
//     //   values.warehouseTrackingDetails.forEach((d) => {
//     //     if (d.libraryItem) {
//     //       d.libraryItem.file = undefined
//     //     }
//     //   })
//     //   const res = await createStockRequest(values)
//     //   if (res.isSuccess) {
//     //     toast({
//     //       title: locale === "vi" ? "Thành công" : "Success",
//     //       description: res.data,
//     //       variant: "success",
//     //     })
//     //     router.push("/management/trackings")
//     //     return
//     //   }
//     //   //*Just do this when submit fail
//     //   values.warehouseTrackingDetails.forEach((d, i) => {
//     //     if (d.libraryItem?.coverImage) {
//     //       form.setValue(
//     //         `warehouseTrackingDetails.${i}.libraryItem.coverImage`,
//     //         d.libraryItem?.coverImage
//     //       )
//     //     }
//     //   })
//     //   if (res.typeError === "form") {
//     //     const key = Object.keys(res.fieldErrors)
//     //       .filter((k) =>
//     //         k
//     //           .toLowerCase()
//     //           .startsWith("warehouseTrackingDetails[".toLowerCase())
//     //       )
//     //       .map((k) => k.replace("warehouseTrackingDetails[", ""))
//     //       .find((k) => k.includes("libraryItem.".toLowerCase()))
//     //     if (key) {
//     //       const index = +key[0]
//     //       if (
//     //         Number(index) &&
//     //         values.warehouseTrackingDetails[index].libraryItem
//     //       ) {
//     //         form.setError(`warehouseTrackingDetails.${index}.itemName`, {
//     //           message: "wrongCatalogInformation",
//     //         })
//     //       }
//     //     }
//     //   }
//     //   handleServerActionError(res, locale, form)
//     // })
//   }

//   // const [selectedCategories, setSelectedCategories] = useState<
//   //   (Category | null)[]
//   // >([])

//   // const triggerCatalogs = async () => {
//   //   let flag = true
//   //   const rows = form.watch("warehouseTrackingDetails")

//   //   const triggerGlobal = await form.trigger([
//   //     "supplierId",
//   //     "description",
//   //     "entryDate",
//   //     "totalAmount",
//   //     "totalItem",
//   //   ])

//   //   flag = triggerGlobal

//   //   for (let i = 0; i < rows.length; ++i) {
//   //     const row = rows[i]

//   //     const selectedCategory =
//   //       selectedCategories[i] ||
//   //       (row.categoryId
//   //         ? categoryItems?.find((c) => c.categoryId === row.categoryId)
//   //         : null)

//   //     if (
//   //       selectedCategory?.isAllowAITraining &&
//   //       !form.watch(`warehouseTrackingDetails.${i}.isbn`)
//   //     ) {
//   //       form.setError(`warehouseTrackingDetails.${i}.isbn`, { message: "min1" })
//   //       flag = false
//   //     }

//   //     if (
//   //       row.stockTransactionType === EStockTransactionType.ADDITIONAL ||
//   //       row.libraryItem === undefined
//   //     )
//   //       continue

//   //     const trigger = await form.trigger(
//   //       [
//   //         `warehouseTrackingDetails.${i}.libraryItem.title`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.subTitle`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.responsibility`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.edition`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.language`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.originLanguage`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.summary`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.publicationPlace`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.publisher`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.publicationYear`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.cutterNumber`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.isbn`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.ean`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.estimatedPrice`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.pageCount`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.physicalDetails`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.dimensions`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.accompanyingMaterial`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.genres`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.generalNote`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.bibliographicalNote`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.topicalTerms`,
//   //         `warehouseTrackingDetails.${i}.libraryItem.additionalAuthors`,
//   //       ],
//   //       { shouldFocus: true }
//   //     )

//   //     const triggerValidImage =
//   //       !form.watch(`warehouseTrackingDetails.${i}.libraryItem.file`) ||
//   //       form.watch(`warehouseTrackingDetails.${i}.libraryItem.validImage`)

//   //     if (!triggerValidImage) {
//   //       form.setError(`warehouseTrackingDetails.${i}.libraryItem.coverImage`, {
//   //         message: "validImageAI",
//   //       })
//   //     }

//   //     const triggerRequireImage =
//   //       !selectedCategory?.isAllowAITraining ||
//   //       form.watch(`warehouseTrackingDetails.${i}.libraryItem.file`)

//   //     if (!triggerRequireImage) {
//   //       form.setError(`warehouseTrackingDetails.${i}.libraryItem.coverImage`, {
//   //         message: "required",
//   //       })
//   //     }

//   //     const triggerRequireDdc =
//   //       !selectedCategory?.isAllowAITraining ||
//   //       form.watch(
//   //         `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`
//   //       )

//   //     if (!triggerRequireDdc) {
//   //       form.setError(
//   //         `warehouseTrackingDetails.${i}.libraryItem.classificationNumber`,
//   //         { message: "required" }
//   //       )
//   //     }

//   //     const triggerRequireCutter =
//   //       !selectedCategory?.isAllowAITraining ||
//   //       form.watch(`warehouseTrackingDetails.${i}.libraryItem.cutterNumber`)

//   //     if (!triggerRequireCutter) {
//   //       form.setError(
//   //         `warehouseTrackingDetails.${i}.libraryItem.cutterNumber`,
//   //         { message: "required" }
//   //       )
//   //     }

//   //     if (
//   //       !trigger ||
//   //       !triggerValidImage ||
//   //       !triggerRequireImage ||
//   //       !triggerRequireDdc ||
//   //       !triggerRequireCutter
//   //     ) {
//   //       form.setError(`warehouseTrackingDetails.${i}.itemName`, {
//   //         message: "wrongCatalogInformation",
//   //       })
//   //       flag = false
//   //     }
//   //   }
//   //   return flag
//   // }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"></form>
//     </Form>
//   )
// }

// export default CreateStockRequestForm
