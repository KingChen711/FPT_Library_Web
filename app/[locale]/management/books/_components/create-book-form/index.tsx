"use client"

import React, {
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useRouter } from "next/navigation"
import { useScanIsbn } from "@/stores/use-scan-isbn"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author, type Category } from "@/lib/types/models"
import {
  bookEditionSchema,
  type TBookEditionSchema,
} from "@/lib/validations/books/create-book"
import {
  trainBookInProgressSchema,
  type TTrainBookInProgressSchema,
} from "@/lib/validations/books/train-book-in-progress"
import { createBook } from "@/actions/books/create-book"
import { uploadMedias } from "@/actions/books/upload-medias"
import useSearchIsbn from "@/hooks/books/use-search-isbn"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import ScannedBook from "@/components/ui/scanned-book"

import CatalogTab from "./catalog-tab"
import CategoryTab from "./category-tab"
import CopiesTab from "./copies-tab"
import Marc21Dialog from "./marc21-dialog"
import { ProgressTabBar } from "./progress-stage-bar"
import ResourcesTab from "./resources-tab"
import TrainBookForm from "./train-book-form"

type Tab =
  | "Category"
  | "Catalog"
  | "Individual registration"
  | "Resources"
  | "Train AI"

function CreateBookForm() {
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [currentTab, setCurrentTab] = useState<Tab>("Category")

  const { isbn, scannedBooks, appendScannedBook, setIsbn } = useScanIsbn()
  const { data: scannedBook, isFetching: isFetchingSearchIsbn } =
    useSearchIsbn(isbn)

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  const [hasConfirmedChangeStatus, setHasConfirmedChangeStatus] =
    useState(false)

  const form = useForm<TBookEditionSchema>({
    resolver: zodResolver(bookEditionSchema),
    defaultValues: {
      title: "",
      libraryItemInstances: [],
    },
  })

  const trainForm = useForm<TTrainBookInProgressSchema>({
    resolver: zodResolver(trainBookInProgressSchema),
    defaultValues: {
      imageList: [],
    },
  })

  const onSubmit = async (values: TBookEditionSchema) => {
    startTransition(async () => {
      const coverImageFile = values.file

      values.libraryItemInstances = values.libraryItemInstances.map((l) => ({
        ...l,
        barcode: (selectedCategory?.prefix || "") + l.barcode,
      }))

      console.log(values)

      await uploadMedias(values)

      console.log(values)

      const res = await createBook(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })

        if (!res.data.bookCode || !selectedCategory?.isAllowAITraining) {
          router.push("/management/books")
          return
        }

        trainForm.setValue("bookCode", res.data.bookCode)
        trainForm.setValue("imageList", [
          {
            checkedResult: values.checkedResult,
            coverImage: values.coverImage,
            validImage: values.validImage,
            file: coverImageFile,
          },
        ])
        setCurrentTab("Train AI")
        return
      }

      //*Just do this when submit fail
      values.libraryResources.forEach((lr, index) => {
        form.setValue(`libraryResources.${index}.resourceUrl`, lr.resourceUrl)
        form.setValue(
          `libraryResources.${index}.providerPublicId`,
          lr.providerPublicId
        )
        form.setValue(`libraryResources.${index}.resourceSize`, lr.resourceSize)
      })
      form.setValue("coverImage", values.coverImage)

      if (res.typeError === "form") {
        if (
          Object.keys(res.fieldErrors).some((key) =>
            ["categoryId"].includes(key)
          )
        ) {
          setCurrentTab("Category")
        } else if (
          Object.keys(res.fieldErrors).some((key) =>
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
            ].includes(key)
          )
        ) {
          setCurrentTab("Catalog")
        } else if (
          Object.keys(res.fieldErrors).some((key) =>
            key.startsWith("libraryItemInstances")
          )
        ) {
          setCurrentTab("Individual registration")
          const message = Object.keys(res.fieldErrors)
            .filter((key) => key.startsWith("libraryItemInstances"))
            .map((key) => res.fieldErrors[key][0])
            .join(", ")
          form.setError("libraryItemInstances", { message })
        } else {
          setCurrentTab("Resources")
        }
      }
      handleServerActionError(res, locale, form)
    })
  }

  const triggerCatalogTab = async () => {
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
        "trackingDetailId",
      ],
      { shouldFocus: true }
    )

    const triggerValidImage = !form.watch("file") || form.watch("validImage")

    if (!triggerValidImage) {
      form.setError("coverImage", { message: "validImageAI" })
    }

    const triggerRequireImage =
      !selectedCategory?.isAllowAITraining || form.watch("file")

    if (!triggerRequireImage) {
      form.setError("coverImage", { message: "required" })
    }

    const triggerRequireDdc =
      !selectedCategory?.isAllowAITraining || form.watch("classificationNumber")

    if (!triggerRequireDdc) {
      form.setError("classificationNumber", { message: "required" })
    }

    const triggerRequireCutter =
      !selectedCategory?.isAllowAITraining || form.watch("cutterNumber")

    if (!triggerRequireCutter) {
      form.setError("cutterNumber", { message: "required" })
    }

    if (
      !trigger ||
      !triggerValidImage ||
      !triggerRequireImage ||
      !triggerRequireDdc ||
      !triggerRequireCutter
    ) {
      setCurrentTab("Catalog")
    }

    return (
      trigger &&
      triggerValidImage &&
      triggerRequireImage &&
      triggerRequireDdc &&
      triggerRequireCutter
    )
  }

  const triggerCopiesTab = async () => {
    const trigger = await form.trigger("libraryItemInstances", {
      shouldFocus: true,
    })

    if (!trigger) {
      setCurrentTab("Individual registration")
    }

    return trigger
  }

  const triggerCategoryTab = async () => {
    const trigger = await form.trigger("categoryId", {
      shouldFocus: true,
    })

    if (!trigger) {
      setCurrentTab("Category")
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
          {/* //TODO:uncomment this */}
          {/* <SocketProvider>
            <IsbnScannerDialog />
          </SocketProvider> */}
        </div>

        <ProgressTabBar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab as Dispatch<SetStateAction<string>>}
          hasTrainAI={selectedCategory?.isAllowAITraining}
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
          <Marc21Dialog form={form} show={currentTab === "Catalog"} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CategoryTab
                show={currentTab === "Category"}
                form={form}
                isPending={isPending}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <CatalogTab
                isRequireImage={!!selectedCategory?.isAllowAITraining}
                form={form}
                isPending={isPending}
                show={currentTab === "Catalog"}
                selectedAuthors={selectedAuthors}
                setSelectedAuthors={setSelectedAuthors}
              />

              <CopiesTab
                form={form}
                isPending={isPending}
                hasConfirmedChangeStatus={hasConfirmedChangeStatus}
                selectedCategory={selectedCategory}
                setHasConfirmedChangeStatus={setHasConfirmedChangeStatus}
                show={currentTab === "Individual registration"}
              />

              <ResourcesTab
                form={form}
                isPending={isPending}
                show={currentTab === "Resources"}
              />

              <div className="flex justify-end gap-x-4">
                <Button
                  disabled={isPending}
                  variant="secondary"
                  className="float-right mt-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (currentTab === "Category") {
                      router.push("/management/books")
                      return
                    }

                    if (currentTab === "Catalog") {
                      setCurrentTab("Category")
                      return
                    }

                    if (currentTab === "Individual registration") {
                      setCurrentTab("Catalog")
                      return
                    }
                    if (currentTab === "Resources") {
                      setCurrentTab("Individual registration")
                      return
                    }
                  }}
                >
                  {t(currentTab !== "Catalog" ? "Back" : "Cancel")}
                </Button>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="float-right mt-4"
                  onClick={async (e) => {
                    if (currentTab === "Resources") {
                      //active the default behaviour (submit)
                      return
                    }

                    e.preventDefault()
                    e.stopPropagation()

                    if (currentTab === "Category") {
                      if (await triggerCategoryTab()) {
                        setCurrentTab("Catalog")
                      }
                      return
                    }

                    if (currentTab === "Catalog") {
                      if (await triggerCatalogTab()) {
                        setCurrentTab("Individual registration")
                      }
                      return
                    }

                    if (currentTab === "Individual registration") {
                      if (await triggerCopiesTab()) {
                        setCurrentTab("Resources")
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

      {currentTab === "Train AI" && (
        <TrainBookForm
          form={trainForm}
          title={form.watch("title")}
          generalNote={form.watch("generalNote")}
          publisher={form.watch("publisher") || ""}
          subTitle={form.watch("subTitle")}
          authorNames={selectedAuthors
            .map((author) => {
              if (form.watch("authorIds")?.includes(author.authorId))
                return author.fullName
              return false
            })
            .filter((item) => item !== false)}
        />
      )}
    </div>
  )
}

export default CreateBookForm
