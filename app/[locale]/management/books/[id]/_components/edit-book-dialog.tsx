"use client"

import React, { useState, useTransition } from "react"
import { NOT_CLOUDINARY_URL } from "@/constants"
import { type BookDetail } from "@/queries/books/get-book"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import {
  editBookSchema,
  type TEditBookSchema,
} from "@/lib/validations/books/edit-book"
import { updateBook } from "@/actions/books/update-book"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { updateBookImage } from "@/actions/resources/update-book-image"
import useCategories from "@/hooks/categories/use-categories"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

import CoverImageField from "./cover-image-field"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  book: BookDetail
}

function EditBookDialog({ open, setOpen, book }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const { data: categoryItems } = useCategories()

  const form = useForm<TEditBookSchema>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      accompanyingMaterial: book.accompanyingMaterial || undefined,
      bibliographicalNote: book.bibliographicalNote || undefined,
      additionalAuthors: book.additionalAuthors || undefined,
      categoryId: book.categoryId,
      classificationNumber: book.classificationNumber || undefined,
      coverImage: book.coverImage || undefined,
      cutterNumber: book.cutterNumber || undefined,
      dimensions: book.dimensions || undefined,
      ean: book.ean || undefined,
      edition: book.edition || undefined,
      editionNumber: book.editionNumber || undefined,
      estimatedPrice: book.estimatedPrice || undefined,
      generalNote: book.generalNote || undefined,
      genres: book.genres || undefined,
      isbn: book.isbn || undefined,
      language: book.language || undefined,
      originLanguage: book.originLanguage || undefined,
      pageCount: book.pageCount || undefined,
      physicalDetails: book.physicalDetails || undefined,
      publicationPlace: book.publicationPlace || undefined,
      publicationYear: book.publicationYear || undefined,
      publisher: book.publisher || undefined,
      responsibility: book.responsibility || undefined,
      shelfId: book.shelfId || undefined,
      subTitle: book.subTitle || undefined,
      summary: book.summary || undefined,
      title: book.title,
      topicalTerms: book.topicalTerms || undefined,
      validImage: book.coverImage ? true : undefined,
      authorIds: book.authors.map((a) => a.authorId) || undefined,
    },
  })

  const onSubmit = async (values: TEditBookSchema) => {
    const triggerRequireImage = !!(
      !book.category?.isAllowAITraining ||
      values.file ||
      values.coverImage
    )

    if (!triggerRequireImage) {
      form.setError("coverImage", { message: "required" })
      form.setFocus("coverImage")
      return
    }

    console.log(book.coverImage)

    startTransition(async () => {
      if (values.file) {
        if (book.coverImage) {
          //update
          const url = URL.createObjectURL(values.file)
          console.log(url)

          const res = await updateBookImage(book.coverImage, values.file)
          if (res !== null && res !== NOT_CLOUDINARY_URL) {
            //set real url to current coverImage (blob url)
            values.coverImage = res.secureUrl
          } else {
            const res = await uploadBookImage(values.file)
            values.coverImage = res?.secureUrl
          }
        } else {
          const res = await uploadBookImage(values.file)
          values.coverImage = res?.secureUrl
        }
      }

      values.file = undefined

      const res = await updateBook(book.libraryItemId, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Edit book")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
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
                          disabled
                          className="min-w-96 max-w-full"
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        {t("ISBN not allowed to edit")}
                      </FormDescription>
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

                <FormField
                  control={form.control}
                  name="categoryId"
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
                        <PopoverContent className="p-0">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CoverImageField
                  authors={book.authors.map((a) => a.fullName)}
                  form={form}
                  isPending={isPending}
                  isRequireImage={!!book.category.isAllowAITraining}
                  initCoverImage={book.coverImage}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}{" "}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookDialog
