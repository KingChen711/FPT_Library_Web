"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useRouter } from "next/navigation"
import { useScanIsbn } from "@/stores/use-scan-isbn"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Printer, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useReactToPrint } from "react-to-print"

import { parsedMarc21 } from "@/lib/parse-marc21"
import { type Author, type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  bookEditionSchema,
  type TBookEditionSchema,
} from "@/lib/validations/books/mutate-book"
import { uploadMedias } from "@/actions/books/upload-medias"
import useSearchIsbn from "@/hooks/books/use-search-isbn"
import useCategories from "@/hooks/categories/use-categories"
import { toast } from "@/hooks/use-toast"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import IsbnScannerDialog from "@/components/ui/isbn-scanner-dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ScannedBook from "@/components/ui/scanned-book"
import { Textarea } from "@/components/ui/textarea"

import AuthorsField from "./authors-field"
import { BarcodesContainer } from "./barcodes-container"
import BookCopiesDialog from "./book-copies-dialog"
import BookResourceFields from "./book-resource-fields"
import CoverImageField from "./cover-image-field"
import { ProgressTabBar } from "./progress-stage-bar"

// const dataTrain = {
//   bookCodeForAITraining: "cae5886f-4492-4093-81cc-284f66bb5dd9",
//   editionImages: [
//     "https://res.cloudinary.com/dchmztiqg/image/upload/v1736589813/8fee60a1-3aad-46df-b0e7-92aee95e6674.jpg",
//     "https://res.cloudinary.com/dchmztiqg/image/upload/v1736589813/59fd80a6-22a9-4d9f-a50e-d654705586cf.jpg",
//   ],
//   message: "Tạo mới thành công",
//   checkedResults: [
//     {
//       file: {},
//       fieldPoints: [
//         {
//           name: "Title",
//           detail: "The Hobbit 2",
//           matchedPoint: 91,
//           isPassed: true,
//         },
//         {
//           name: "Author 1",
//           detail: "David White",
//           matchedPoint: 19,
//           isPassed: false,
//         },
//         {
//           name: "Publisher",
//           detail: "Oreiley",
//           matchedPoint: 15,
//           isPassed: false,
//         },
//       ],
//       totalPoint: 54.2,
//       confidenceThreshold: 30,
//     },
//     {
//       file: {},
//       fieldPoints: [
//         {
//           name: "Title",
//           detail: "The Hobbit special",
//           matchedPoint: 71,
//           isPassed: true,
//         },
//         {
//           name: "Author 1",
//           detail: "David White",
//           matchedPoint: 31,
//           isPassed: true,
//         },
//         {
//           name: "Publisher",
//           detail: "Oreiley",
//           matchedPoint: 29,
//           isPassed: false,
//         },
//       ],
//       totalPoint: 50.599999999999994,
//       confidenceThreshold: 30,
//     },
//   ],
// }

type Tab =
  | "General"
  | "Binding"
  | "Resources"
  | "Copies"
  | "Print barcodes"
  | "Train AI"

function CreateBookForm() {
  const { isbn, scannedBooks, appendScannedBook, setIsbn } = useScanIsbn()
  const { data: scannedBook, isFetching: isFetchingSearchIsbn } =
    useSearchIsbn(isbn)
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const [currentTab, setCurrentTab] = useState<Tab>("General")

  const { data: categoryItems } = useCategories()
  const [openCategoriesCombobox, setOpenCategoriesCombobox] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
  const [marc21, setMarc21] = useState("")
  const [hasConfirmedChangeStatus, setHasConfirmedChangeStatus] =
    useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const barcodesPrintRef = useRef<HTMLDivElement>(null)
  const handlePrintBarcodes = useReactToPrint({
    contentRef: barcodesPrintRef,
  })

  // const [trainAIData, setTrainAIData] = useState<
  //   | (TCreateBookRes & {
  //       checkedResults: (TCheckedResultSchema & { file: File })[]
  //     })
  //   | null
  // >(dataTrain)

  const form = useForm<TBookEditionSchema>({
    resolver: zodResolver(bookEditionSchema),
    defaultValues: {
      title: "",
      libraryItemInstances: [],
    },
  })

  const handleParseMarc21 = () => {
    try {
      const marc21Data = parsedMarc21(marc21)
      form.setValue("title", marc21Data.title)
      form.setValue("subTitle", marc21Data.subTitle)
      form.setValue("responsibility", marc21Data.responsibility)
      form.setValue("edition", marc21Data.edition)
      form.setValue("language", marc21Data.language)
      form.setValue("originLanguage", marc21Data.originLanguage)
      form.setValue("summary", marc21Data.summary)
      form.setValue("publicationPlace", marc21Data.publicationPlace)
      form.setValue("publisher", marc21Data.publisher)
      form.setValue("publicationYear", marc21Data.publicationYear)
      form.setValue("classificationNumber", marc21Data.classificationNumber)
      form.setValue("cutterNumber", marc21Data.cutterNumber)
      form.setValue("isbn", marc21Data.isbn)
      form.setValue("ean", marc21Data.ean)
      form.setValue("estimatedPrice", marc21Data.estimatedPrice)
      form.setValue("pageCount", marc21Data.pageCount)
      form.setValue("physicalDetails", marc21Data.physicalDetails)
      form.setValue("dimensions", marc21Data.dimensions)
      form.setValue("accompanyingMaterial", marc21Data.accompanyingMaterial)
      form.setValue("genres", marc21Data.genres)
      form.setValue("generalNote", marc21Data.generalNote)
      form.setValue("bibliographicalNote", marc21Data.bibliographicalNote)
      form.setValue("topicalTerms", marc21Data.topicalTerms)
      form.setValue("additionalAuthors", marc21Data.additionalAuthors)
      form.setValue("author", marc21Data.author)
    } catch (error) {
      console.log(error)

      toast({
        title: locale === "vi" ? "Thất bại" : "Failed",
        description: locale === "vi" ? "Marc21 không hợp lệ" : "Invalid Marc21",
        variant: "danger",
      })
    } finally {
      setMarc21("")
    }
  }

  const onSubmit = async (values: TBookEditionSchema) => {
    startTransition(async () => {
      values.libraryItemInstances = values.libraryItemInstances.map((l) => ({
        ...l,
        barcode: (selectedCategory?.prefix || "") + l.barcode,
      }))

      await uploadMedias(values)

      //TODO:just need do this on submit to API fail
      values.libraryResources.forEach((lr, index) => {
        form.setValue(`libraryResources.${index}.resourceUrl`, lr.resourceUrl)
      })

      console.log(values)

      // const res = await createBook(values)
      // if (res.isSuccess) {
      //   toast({
      //     title: locale === "vi" ? "Thành công" : "Success",
      //     description: res.data.message,
      //     variant: "success",
      //   })
      //   const checkedResults: (TCheckedResultSchema & { file: File })[] = form
      //     .getValues("bookEditions")
      //     .map((be, i) => ({
      //       file: coverFiles[i],
      //       ...be.checkedResult!,
      //     }))
      //   // setTrainAIData({
      //   //   ...res.data,
      //   //   checkedResults: checkedResults,
      //   // })
      //   setCurrentTab("Train AI")
      //   return
      // }
      // if (res.typeError === "form") {
      //   if (
      //     Object.keys(res.fieldErrors).some((key) =>
      //       [
      //         "bookCode",
      //         "title",
      //         "subTitle",
      //         "summary",
      //         "categoryIds",
      //       ].includes(key)
      //     )
      //   ) {
      //     setCurrentTab("General")
      //   } else if (
      //     Object.keys(res.fieldErrors).some((key) =>
      //       key.startsWith("bookResources")
      //     )
      //   ) {
      //     setCurrentTab("Resources")
      //   } else {
      //     setCurrentTab("Editions")
      //     const keyBookEditions = Object.keys(res.fieldErrors).find((key) =>
      //       key.startsWith("bookEditions")
      //     )
      //     if (keyBookEditions) {
      //       setCurrentEditionIndex(
      //         +keyBookEditions.split("bookEditions[")[1][0]
      //       )
      //     }
      //     const indexToMessage = new Map<number, string>()
      //     Object.keys(res.fieldErrors)
      //       .filter(
      //         (key) =>
      //           key.startsWith("bookEditions") && key.includes("bookCopies")
      //       )
      //       .forEach((key, i) => {
      //         const index = +key.split("bookEditions[")[1][0]
      //         const val = indexToMessage.get(index) || ""
      //         indexToMessage.set(
      //           index,
      //           val + (i !== 0 ? ", " : "") + res.fieldErrors[key][0]
      //         )
      //         delete res.fieldErrors[key]
      //       })
      //     indexToMessage.forEach((value, key) => {
      //       form.setError(`bookEditions.${key}.bookCopies`, { message: value })
      //     })
      //   }
      // }
      // handleServerActionError(res, locale, form)
    })
  }

  const triggerGeneralTab = async () => {
    const trigger = await form.trigger(
      [
        "title",
        "subTitle",
        "responsibility",
        "edition",
        "language",
        "originLanguage",
        "summary",
        "publicationPlace",
        "publisher",
        "publicationYear",
        "classificationNumber",
        "cutterNumber",
        "isbn",
        "ean",
        "estimatedPrice",
        "pageCount",
        "physicalDetails",
        "dimensions",
        "accompanyingMaterial",
        "genres",
        "generalNote",
        "bibliographicalNote",
        "topicalTerms",
        "additionalAuthors",
      ],
      { shouldFocus: true }
    )

    if (!trigger) setCurrentTab("General")

    return trigger
  }

  const triggerBindingTab = async () => {
    const triggerCategory = await form.trigger(["categoryId"], {
      shouldFocus: true,
    })

    const triggerImage = !form.watch("file") || form.watch("validImage")

    if (!triggerImage) {
      form.setError("coverImage", { message: "validImageAI" })
    }

    if (!triggerCategory || !triggerImage) {
      setCurrentTab("Binding")
    }

    return triggerCategory && triggerImage
  }

  const triggerBookResourcesTab = async () => {
    const trigger = await form.trigger("libraryResources", {
      shouldFocus: true,
    })

    if (!trigger) {
      setCurrentTab("Resources")
    }

    return trigger
  }

  const triggerCopiesTab = async () => {
    const trigger = await form.trigger("libraryItemInstances", {
      shouldFocus: true,
    })

    if (!trigger) {
      setCurrentTab("Copies")
    }

    return trigger
  }

  useEffect(() => {
    if (!scannedBook) return

    console.log({ scannedBook })

    setIsbn("")

    if (scannedBook.notFound) {
      toast({
        description: t("not found isbn", { isbn: scannedBook.isbn }),
      })
      return
    }

    appendScannedBook(scannedBook)
  }, [scannedBook, appendScannedBook, locale, t, setIsbn])

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">{t("Create book")}</h3>
          <IsbnScannerDialog />
        </div>

        <ProgressTabBar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab as Dispatch<SetStateAction<string>>}
        />
      </div>

      {isFetchingSearchIsbn && (
        <div className="flex items-center gap-2">
          {t("Loading scanned book")}
          <Loader2 className="size-4 animate-spin" />{" "}
        </div>
      )}

      {scannedBooks.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>{t("Scanned book")}</Label>
          <div className="grid">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-6">
              {scannedBooks.map((book) => (
                <div
                  key={book.isbn}
                  className="mt-4 flex h-full flex-col gap-2"
                >
                  {book.notFound ? (
                    <div className="text-sm">
                      {t("not found isbn", { isbn: book.isbn })}
                    </div>
                  ) : (
                    <ScannedBook book={book} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentTab !== "Train AI" && (
        <div className="mt-4 flex flex-col gap-4">
          {currentTab === "General" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">{t("Copy catalog")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("Copy catalog")}</DialogTitle>
                  <DialogDescription>
                    <Label className="mb-2">Marc21</Label>
                    <Textarea
                      value={marc21}
                      onChange={(e) => setMarc21(e.target.value)}
                      rows={8}
                    />
                    <div className="mt-4 flex justify-end gap-4">
                      <DialogClose>
                        <Button variant="outline">{t("Cancel")}</Button>
                      </DialogClose>
                      <DialogClose>
                        <Button onClick={handleParseMarc21}>
                          {t("Continue")}
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentTab === "General" && (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Title")} (245a)
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Sub title")} (245b)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responsibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Responsibility")} (245c)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="edition"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Edition")} (250a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="editionNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Edition number")}
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Language")} (041a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originLanguage"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Original language")} (041h)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Summary")} (520a)
                        </FormLabel>

                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publicationYear"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Publication year")} (260c)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Publisher")} (260b)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publicationPlace"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Publication place")} (260a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classificationNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Classification number")} (082a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cutterNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Cutter number")} (082b)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          ISBN (020a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ean"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          EAN (024a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimatedPrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Estimated price")} (020c)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pageCount"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Page count")} (300a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="physicalDetails"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Physical details")} (300b)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Dimensions")} (300c)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accompanyingMaterial"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Accompanying material")} (300e)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Genres")} (655a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="generalNote"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("General note")} (500a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bibliographicalNote"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Bibliographical note")} (504a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topicalTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Topical terms")} (650a)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalAuthors"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Additional authors")} (700a,e)
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="min-w-96 max-w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentTab === "Binding" && (
                <>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {t("Category")}{" "}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <Popover
                          open={openCategoriesCombobox}
                          onOpenChange={setOpenCategoriesCombobox}
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
                              >
                                {field.value
                                  ? locale === "vi"
                                    ? categoryItems?.find(
                                        (t) => t.categoryId === field.value
                                      )?.vietnameseName || ""
                                    : categoryItems?.find(
                                        (t) => t.categoryId === field.value
                                      )?.englishName || ""
                                  : t("Select category")}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder={t("Search category")}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {t("No category found")}
                                </CommandEmpty>
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
                                          "categoryId",
                                          category.categoryId
                                        )
                                        setSelectedCategory(category)
                                        setOpenCategoriesCombobox(false)
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AuthorsField
                    selectedAuthors={selectedAuthors}
                    setSelectedAuthors={setSelectedAuthors}
                    form={form}
                    isPending={isPending}
                  />

                  <CoverImageField
                    selectedAuthors={selectedAuthors}
                    form={form}
                    isPending={isPending}
                  />
                </>
              )}

              {currentTab === "Resources" && (
                <>
                  <FormField
                    control={form.control}
                    name="libraryResources"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t("Book resources")}</FormLabel>
                        <FormControl>
                          <BookResourceFields
                            form={form}
                            isPending={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentTab === "Copies" && (
                <FormField
                  control={form.control}
                  name="libraryItemInstances"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FormLabel>
                          {t("Book copies")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <BookCopiesDialog
                          form={form}
                          isPending={isPending}
                          prefix={selectedCategory?.prefix || ""}
                          hasConfirmedChangeStatus={hasConfirmedChangeStatus}
                          setHasConfirmedChangeStatus={
                            setHasConfirmedChangeStatus
                          }
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {field.value.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            {t("Empty copies")}
                          </div>
                        )}
                        {field.value.map((bc) => (
                          <div
                            key={bc.barcode}
                            className="relative flex flex-row items-center gap-x-4 rounded-md border bg-muted px-2 py-1 text-muted-foreground"
                          >
                            <div className="flex flex-col text-sm">
                              <div>
                                <strong>{t("Code")}:</strong>{" "}
                                {selectedCategory?.prefix
                                  ? selectedCategory.prefix
                                  : null}
                                {bc.barcode}
                              </div>
                              <div className="flex items-center gap-2">
                                <strong>{t("Status")}:</strong>
                                <BookConditionStatusBadge
                                  status={bc.conditionStatus}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentTab === "Print barcodes" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start">
                    <Label>{t("Barcodes")}</Label>
                    <Button
                      onClick={() => handlePrintBarcodes()}
                      size="icon"
                      variant="ghost"
                      disabled={isPending}
                    >
                      <Printer className="text-primary" />
                    </Button>
                  </div>
                  <BarcodesContainer
                    ref={barcodesPrintRef}
                    form={form}
                    prefix={selectedCategory?.prefix || ""}
                  />
                </div>
              )}

              <div className="flex justify-end gap-x-4">
                <Button
                  disabled={isPending}
                  variant="secondary"
                  className="float-right mt-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (currentTab === "General") {
                      router.push("/management/books")
                      return
                    }
                    if (currentTab === "Binding") {
                      setCurrentTab("General")
                      return
                    }
                    if (currentTab === "Resources") {
                      setCurrentTab("Binding")
                      return
                    }
                    if (currentTab === "Copies") {
                      setCurrentTab("Resources")
                      return
                    }
                    if (currentTab === "Print barcodes") {
                      setCurrentTab("Copies")
                      return
                    }
                  }}
                >
                  {t(currentTab !== "General" ? "Back" : "Cancel")}
                </Button>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="float-right mt-4"
                  onClick={async (e) => {
                    if (currentTab !== "Print barcodes") {
                      e.preventDefault()
                      e.stopPropagation()
                    }

                    if (currentTab === "General") {
                      if (await triggerGeneralTab()) {
                        setCurrentTab("Binding")
                      }
                      return
                    }
                    if (currentTab === "Binding") {
                      if (await triggerBindingTab()) {
                        setCurrentTab("Resources")
                      }
                    }
                    if (currentTab === "Resources") {
                      if (await triggerBookResourcesTab()) {
                        setCurrentTab("Copies")
                      }
                      return
                    }
                    if (currentTab === "Copies") {
                      if (await triggerCopiesTab()) {
                        setCurrentTab("Print barcodes")
                      }
                      return
                    }
                  }}
                >
                  {t("Continue")}
                  {isPending && (
                    <Loader2 className="ml-1 size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* {currentTab === "Train AI" && <TrainAIForm trainAIData={trainAIData!} />} */}
    </div>
  )
}

export default CreateBookForm
