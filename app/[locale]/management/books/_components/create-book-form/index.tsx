"use client"

import React, {
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useRouter } from "next/navigation"
import { type TrackingDetailCatalog } from "@/queries/trackings/get-tracking-detail"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EResourceBookType } from "@/lib/types/enums"
import { type Author, type Category } from "@/lib/types/models"
import {
  bookEditionSchema,
  type TBookEditionSchema,
} from "@/lib/validations/books/create-book"
import { createBook } from "@/actions/books/create-book"
import useUploadCatalogMedias from "@/hooks/media/use-upload-catalog-medias"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import TrackingDetailCard from "@/components/ui/tracking-detail-card"

import CreateAuthorDialog from "../../../authors/_components/create-author-dialog"
import CatalogTab from "./catalog-tab"
import CategoryTab from "./category-tab"
import CopiesTab from "./copies-tab"
import GroupsTab from "./groups-tab"
import Marc21Dialog from "./marc21-dialog"
import { ProgressTabBar } from "./progress-stage-bar"
import ResourcesTab from "./resources-tab"
import { TrackingCard } from "./tracking-card"

type Tab =
  | "Category"
  | "Catalog"
  | "Groups"
  | "Individual registration"
  | "Resources"

type Props = {
  trackingDetail?: TrackingDetailCatalog | null
}

function CreateBookForm({ trackingDetail }: Props) {
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()
  const locale = useLocale()

  //user come from warehouse page
  const fromWarehouseMode = !!trackingDetail

  const [isPending, startTransition] = useTransition()
  const [currentTab, setCurrentTab] = useState<Tab>("Category")

  // const { isbn, scannedBooks, appendScannedBook, setIsbn } = useScanIsbn()
  // const { data: scannedBook, isFetching: isFetchingSearchIsbn } =
  //   useSearchIsbn(isbn)

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  // const [hasConfirmedChangeStatus, setHasConfirmedChangeStatus] =
  //   useState(false)

  const { mutateAsync: uploadMedias } = useUploadCatalogMedias()

  const form = useForm<TBookEditionSchema>({
    resolver: zodResolver(bookEditionSchema),
    defaultValues: {
      title: trackingDetail?.itemName,
      isbn: trackingDetail?.isbn || undefined,
      estimatedPrice: trackingDetail?.unitPrice || undefined,
      libraryItemInstances: [],
      categoryId: trackingDetail?.categoryId,
      trackingDetailId: trackingDetail?.trackingDetailId,
      authorIds: [],
      libraryResources: [],
    },
  })

  // const trainForm = useForm<TTrainBookInProgressSchema>({
  //   resolver: zodResolver(trainBookInProgressSchema),
  //   defaultValues: {
  //     imageList: [],
  //   },
  // })

  //TODO(isNotBook)
  const isNotBook =
    selectedCategory?.englishName === "Magazine" ||
    selectedCategory?.englishName === "ChildrenBook" ||
    selectedCategory?.englishName === "Newspaper" ||
    selectedCategory?.englishName === "Other" ||
    false

  const onSubmit = async (values: TBookEditionSchema) => {
    startTransition(async () => {
      await uploadMedias(values)

      values.libraryItemInstances = []

      const res = await createBook(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        router.push("/management/books")

        return
      }

      //*Just do this when submit fail
      values.libraryResources.forEach((lr, index) => {
        if (lr.resourceType === EResourceBookType.AUDIO_BOOK) {
          form.setValue(
            `libraryResources.${index}.s3OriginalName`,
            lr.s3OriginalName
          )
        } else {
          form.setValue(`libraryResources.${index}.resourceUrl`, lr.resourceUrl)
        }
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
          form.setError(
            "libraryItemInstances",
            { message },
            { shouldFocus: true }
          )
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
      form.setError(
        "coverImage",
        { message: "validImageAI" },
        { shouldFocus: true }
      )
    }

    const triggerRequireImage = isNotBook || form.watch("file")

    if (!triggerRequireImage) {
      form.setError(
        "coverImage",
        { message: "required" },
        { shouldFocus: true }
      )
    }

    const triggerRequireDdc = form.watch("classificationNumber")

    if (!triggerRequireDdc) {
      form.setError(
        "classificationNumber",
        { message: "required" },
        { shouldFocus: true }
      )
    }

    const triggerRequireCutter = form.watch("cutterNumber")

    if (!triggerRequireCutter) {
      form.setError(
        "cutterNumber",
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

  // useEffect(() => {
  //   if (!scannedBook) return

  //   setIsbn("")

  //   if (scannedBook.notFound) {
  //     toast({
  //       description: t("not found isbn", { isbn: scannedBook.isbn }),
  //     })
  //     return
  //   }

  //   appendScannedBook(scannedBook)
  // }, [scannedBook, appendScannedBook, locale, t, setIsbn])

  const isBookSeries = selectedCategory?.englishName === "BookSeries" || false
  // const isNotBook =
  //   selectedCategory?.englishName === "Magazine" ||
  //   selectedCategory?.englishName === "Newspaper" ||
  //   selectedCategory?.englishName === "Other" ||
  //   false

  const [openCreateAuthor, setOpenCreateAuthor] = useState(false)

  return (
    <>
      <CreateAuthorDialog
        noTrigger
        open={openCreateAuthor}
        setOpen={setOpenCreateAuthor}
      />
      <div>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">
              {t(fromWarehouseMode ? "Catalog" : "Create book")}
            </h3>
          </div>

          <ProgressTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab as Dispatch<SetStateAction<string>>}
            isBookSeries={isBookSeries}
          />
        </div>

        {/* {isFetchingSearchIsbn && (
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
        )} */}

        {/* {currentTab !== "Train AI" && ( */}
        <div className="mt-4 flex flex-col gap-4">
          {fromWarehouseMode && (
            <div>
              <Label>{t("Tracking details")}</Label>
              <div className="flex items-center">
                <TrackingCard tracking={trackingDetail.warehouseTracking} />
                <ArrowRight className="size-9" />
                <TrackingDetailCard
                  trackingDetail={trackingDetail}
                  category={trackingDetail.category}
                />
              </div>
            </div>
          )}
          <Marc21Dialog
            form={form}
            show={currentTab === "Catalog"}
            getIsbn={!fromWarehouseMode && !form.watch("trackingDetailId")}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CategoryTab
                fromWarehouseMode={fromWarehouseMode}
                show={currentTab === "Category"}
                form={form}
                isPending={isPending}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <CatalogTab
                fromWarehouseMode={fromWarehouseMode}
                isRequireImage={!isNotBook}
                form={form}
                isPending={isPending}
                show={currentTab === "Catalog"}
                selectedAuthors={selectedAuthors}
                setSelectedAuthors={setSelectedAuthors}
                setOpenCreateAuthor={setOpenCreateAuthor}
              />

              <GroupsTab
                form={form}
                isPending={isPending}
                show={currentTab === "Groups"}
                selectedAuthors={selectedAuthors}
              />

              <CopiesTab
                form={form}
                isPending={isPending}
                // hasConfirmedChangeStatus={hasConfirmedChangeStatus}
                selectedCategory={selectedCategory}
                // setHasConfirmedChangeStatus={setHasConfirmedChangeStatus}
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
                        if (isBookSeries) {
                          setCurrentTab("Groups")
                        } else {
                          setCurrentTab("Individual registration")
                        }
                      }
                      return
                    }

                    if (currentTab === "Groups") {
                      setCurrentTab("Individual registration")
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
        {/* )} */}

        {/* {currentTab === "Train AI" && (
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
        )} */}
      </div>
    </>
  )
}

export default CreateBookForm
