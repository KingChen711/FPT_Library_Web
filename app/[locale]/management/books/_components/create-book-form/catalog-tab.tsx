import React, { type SetStateAction } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type Author } from "@/lib/types/models"
import { generateCutter } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"

import AuthorsField from "./authors-field"
import CoverImageField from "./cover-image-field"
import StockInDetailField from "./stock-in-detail-field"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  show: boolean
  selectedAuthors: Author[]
  setSelectedAuthors: React.Dispatch<SetStateAction<Author[]>>
  isRequireImage: boolean
  fromWarehouseMode?: boolean
}

function CatalogTab({
  form,
  isPending,
  show,
  selectedAuthors,
  setSelectedAuthors,
  isRequireImage,
  fromWarehouseMode = false,
}: Props) {
  const t = useTranslations("BooksManagementPage")

  const handleGenerateCutterNumber = (text: string) => {
    form.setValue("cutterNumber", generateCutter(text))
    console.log(generateCutter(text))
  }

  if (!show) return null

  return (
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
              <Button asChild variant="link" className="h-auto min-h-0 p-0">
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
        name="cutterNumber"
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
              <Button asChild variant="link" className="h-auto min-h-0 p-0">
                <Link target="_blank" href="/guides/cutter-number">
                  {t("What is cutter number")}
                </Link>
              </Button>
              <GenerateCutterNumberDialog
                handleGenerateCutterNumber={handleGenerateCutterNumber}
              />
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isbn"
        render={({ field }) => (
          <FormItem className="flex flex-1 flex-col items-start">
            <FormLabel className="flex items-center">ISBN (020a)</FormLabel>

            <FormControl>
              <Input {...field} disabled className="min-w-96 max-w-full" />
            </FormControl>
            <FormDescription>{t("Base on tracking detail")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ean"
        render={({ field }) => (
          <FormItem className="flex flex-1 flex-col items-start">
            <FormLabel className="flex items-center">EAN (024a)</FormLabel>

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
              <CurrencyInput
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

      {fromWarehouseMode && (
        <StockInDetailField form={form} isPending={isPending} />
      )}
    </>
  )
}

export default CatalogTab
