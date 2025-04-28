import React, { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { Check, ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type Author, type Category } from "@/lib/types/models"
import { cn, generateCutter } from "@/lib/utils"
import { type TAddTrackingDetailSchema } from "@/lib/validations/trackings/add-tracking-detail"
import useCategories from "@/hooks/categories/use-categories"
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
} from "@/components/ui/dialog"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import GenerateCutterNumberDialog from "@/components/ui/generate-cutter-number-dialog"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"

import CoverImageField from "./add-tracking-detail-cover-image-field"
import AuthorsField from "./authors-field"
import Marc21Dialog from "./marc21-dialog"

type Props = {
  form: UseFormReturn<TAddTrackingDetailSchema>
  isPending: boolean
  category: Category | null
  setCategory: (val: Category | null) => void
  open: boolean
  setOpen: (val: boolean) => void
}

function CatalogDialog({
  form,
  isPending,
  category,
  setCategory,
  open,
  setOpen,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)

  const { data: categoryItems } = useCategories()

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])

  const handleGenerateCutterNumber = (text: string) => {
    form.setValue(`libraryItem.cutterNumber`, generateCutter(text))
  }

  const isRequireImage = !!category?.isAllowAITraining

  const watchCategoryId = form.watch(`libraryItem.categoryId`)

  const watchTitle = form.watch(`libraryItem.title`)

  useEffect(() => {
    form.setValue(`itemName`, watchTitle || "")
    form.clearErrors(`itemName`)
  }, [watchTitle, form])

  const watchIsbn = form.watch(`libraryItem.isbn`)

  useEffect(() => {
    form.setValue(`isbn`, watchIsbn || "")
    form.clearErrors(`isbn`)
  }, [watchIsbn, form])

  const watchEstimatedPrice = form.watch(`libraryItem.estimatedPrice`)

  useEffect(() => {
    form.setValue(`unitPrice`, watchEstimatedPrice || 0)
    form.clearErrors(`unitPrice`)
  }, [watchEstimatedPrice, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[80vh] w-[90vw] max-w-[1620px] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2">{t("Catalog")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name={`libraryItem.categoryId`}
                render={({ field: _ }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t("Category")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
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
                              !watchCategoryId && "text-muted-foreground"
                            )}
                            disabled={isPending}
                          >
                            {watchCategoryId
                              ? locale === "vi"
                                ? categoryItems?.find(
                                    (category) =>
                                      category.categoryId === watchCategoryId
                                  )?.vietnameseName
                                : categoryItems?.find(
                                    (category) =>
                                      category.categoryId === watchCategoryId
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
                                      `categoryId`,
                                      category.categoryId
                                    )
                                    form.clearErrors(`categoryId`)
                                    form.setValue(
                                      `libraryItem.categoryId`,
                                      category.categoryId
                                    )
                                    form.clearErrors(`libraryItem.categoryId`)
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
                                      category.categoryId === watchCategoryId
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

              {watchCategoryId && (
                <>
                  <Separator />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-lg font-bold">
                        {t("Item information")}
                      </div>
                      <div className="flex items-center gap-4">
                        <Marc21Dialog form={form} />
                        <Button
                          variant="outline"
                          onClick={() => {
                            form.setValue(`libraryItem`, undefined)
                            form.clearErrors(`itemName`)
                          }}
                        >
                          {t("Delete catalog information")}
                        </Button>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name={`libraryItem.title`}
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
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`libraryItem.subTitle`}
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
                      name={`libraryItem.responsibility`}
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
                      name={`libraryItem.edition`}
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
                      name={`libraryItem.editionNumber`}
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
                      name={`libraryItem.language`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Language")} (041a)
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
                      name={`libraryItem.originLanguage`}
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
                      name={`libraryItem.publicationPlace`}
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
                      name={`libraryItem.publicationYear`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Publication year")} (260c)
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
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
                      name={`libraryItem.publisher`}
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
                      name={`libraryItem.summary`}
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
                      name={`libraryItem.classificationNumber`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Classification number")} (082a)
                            {isRequireImage && (
                              <span className="ml-1 text-xl font-bold leading-none text-primary">
                                *
                              </span>
                            )}
                          </FormLabel>

                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              className="min-w-96 max-w-full"
                            />
                          </FormControl>
                          <FormDescription>
                            <Button
                              asChild
                              variant="link"
                              className="h-auto min-h-0 p-0"
                            >
                              <Link target="_blank" href="/guides/ddc">
                                {t("What is DDC")}
                              </Link>
                            </Button>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`libraryItem.cutterNumber`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Cutter number")} (082b)
                            {isRequireImage && (
                              <span className="ml-1 text-xl font-bold leading-none text-primary">
                                *
                              </span>
                            )}
                          </FormLabel>

                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              className="min-w-96 max-w-full"
                            />
                          </FormControl>

                          <div className="flex items-center gap-4 text-muted-foreground">
                            <Button
                              asChild
                              variant="link"
                              className="h-auto min-h-0 p-0"
                            >
                              <Link
                                target="_blank"
                                href="/guides/cutter-number"
                              >
                                {t("What is cutter number")}
                              </Link>
                            </Button>
                            <GenerateCutterNumberDialog
                              handleGenerateCutterNumber={
                                handleGenerateCutterNumber
                              }
                            />
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`libraryItem.isbn`}
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
                              onChange={(e) => {
                                field.onChange(e)
                                form.setValue(`isbn`, e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`libraryItem.ean`}
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
                      name={`libraryItem.estimatedPrice`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Estimated price")} (020c)
                          </FormLabel>

                          <FormControl>
                            <CurrencyInput
                              {...field}
                              type="number"
                              disabled={isPending}
                              className="min-w-96 max-w-full"
                              onChange={(num) => {
                                field.onChange(num)
                                form.setValue(`unitPrice`, num || 0)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`libraryItem.pageCount`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Page count")} (300a)
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
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
                      name={`libraryItem.physicalDetails`}
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
                      name={`libraryItem.dimensions`}
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Dimensions")} (300c)
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
                      name={`libraryItem.accompanyingMaterial`}
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
                      name={`libraryItem.genres`}
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
                      name={`libraryItem.generalNote`}
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
                      name={`libraryItem.bibliographicalNote`}
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
                      name={`libraryItem.topicalTerms`}
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
                      name={`libraryItem.additionalAuthors`}
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
                  </div>

                  <AuthorsField
                    selectedAuthors={selectedAuthors}
                    setSelectedAuthors={setSelectedAuthors}
                    form={form}
                    isPending={isPending}
                  />

                  <CoverImageField
                    isRequireImage={isRequireImage}
                    selectedAuthors={selectedAuthors}
                    form={form}
                    isPending={isPending}
                  />
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CatalogDialog
