"use client"

import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { editorPlugin } from "@/constants"
import { type BookEditionDetail } from "@/queries/books/get-book-edition"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookFormat } from "@/lib/types/enums"
import { cn, fileUrlToFile } from "@/lib/utils"
import {
  updateEditionSchema,
  type TUpdateEditionSchema,
} from "@/lib/validations/books/book-editions/update-edition"
import { updateEdition } from "@/actions/books/editions/update-edition"
import { uploadBookImage } from "@/actions/books/upload-medias"
import useCheckCoverImage, {
  type TCheckCoverImageRes,
} from "@/hooks/books/use-check-cover-image"
import { toast } from "@/hooks/use-toast"
import useActualTheme from "@/hooks/utils/use-actual-theme"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ShelfSelector from "@/app/[locale]/management/books/_components/shelf-selector"

type Props = {
  edition: BookEditionDetail
  open: boolean
  setOpen: (value: boolean) => void
}

function UpdateEditionDialog({ edition, open, setOpen }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const theme = useActualTheme()

  const [isPending, startTransition] = useTransition()

  const [disableImageField, setDisableImageField] = useState(false)

  const [checkedResult, setCheckedResult] =
    useState<TCheckCoverImageRes | null>(null)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const { mutate: checkImage, isPending: checkingImage } = useCheckCoverImage()

  const [hasConvertedUrlToFile, setHasConvertedUrlToFile] = useState(false)

  const form = useForm<TUpdateEditionSchema>({
    resolver: zodResolver(updateEditionSchema),
    defaultValues: {
      coverImage: edition.coverImage || "",
      editionNumber: edition.editionNumber,
      editionSummary: edition.editionSummary || "",
      editionTitle: edition.editionTitle,
      estimatedPrice: edition.estimatedPrice || 0,
      format: edition.format || EBookFormat.PAPERBACK,
      isbn: edition.isbn,
      language: edition.language,
      pageCount: edition.pageCount,
      publicationYear: edition.publicationYear,
      publisher: edition.publisher || "",
      validImage: edition.coverImage ? true : undefined,
    },
  })

  const onSubmit = async (values: TUpdateEditionSchema) => {
    startTransition(async () => {
      if (values.file) {
        const res = await uploadBookImage(values.file)
        if (res) {
          values.coverImage = res.secureUrl
        }
      }

      values.file = undefined

      const res = await updateEdition({
        ...values,
        bookId: edition.bookId,
        editionId: edition.bookEditionId,
      })

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

  const watchEditionTitle = form.watch(`editionTitle`)
  const watchPublisher = form.watch(`publisher`)
  const watchFile = form.watch(`file`)
  const watchValidImage = form.watch(`validImage`)

  const canCheck = !!(
    watchEditionTitle &&
    watchPublisher &&
    watchFile &&
    !checkingImage
  )

  const handleCheckImage = () => {
    const formData = new FormData()

    const file = form.getValues(`file`)

    if (!file) return

    formData.append("Image", file)

    const editionTitle = form.getValues(`editionTitle`)
    const publisher = form.getValues(`publisher`)
    const authors = edition.authors.map((a) => a.fullName)

    formData.append("Title", editionTitle)
    formData.append("Publisher", publisher)

    authors.forEach((author) => {
      formData.append("Authors", author)
    })

    checkImage(formData, {
      onSuccess: (data) => {
        setCheckedResult(data)

        form.setValue(`validImage`, data.totalPoint >= data.confidenceThreshold)
      },
    })
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file.type.includes("image")) return

      if (file.size >= 10 * 1024 * 1024) {
        form.setError(`coverImage`, {
          message: "Ảnh quá lớn.",
        })
        return
      }

      form.clearErrors(`coverImage`)

      form.setValue(`file`, file)

      fileReader.onload = async () => {
        // const imageDataUrl =
        //   typeof event.target?.result === "string" ? event.target.result : ""
        const url = URL.createObjectURL(file)
        fieldChange(url)
      }

      fileReader.readAsDataURL(file)

      handleCheckImage()
    }
  }

  useEffect(() => {
    const handleConvert = async () => {
      if (!edition.coverImage) return
      const file = await fileUrlToFile(edition.coverImage, "cover-image")
      form.setValue("file", file)
    }

    handleConvert().finally(() => {
      setHasConvertedUrlToFile(true)
    })
  }, [form, edition.coverImage])

  useEffect(() => {
    if (
      !form.getValues(`editionTitle`) ||
      !form.getValues(`publisher`) ||
      !hasConvertedUrlToFile
    ) {
      setDisableImageField(true)
    } else {
      setDisableImageField(false)
    }
  }, [form, watchEditionTitle, watchPublisher, hasConvertedUrlToFile])

  useEffect(() => {
    form.setValue("validImage", undefined)
  }, [form, watchEditionTitle, watchPublisher])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Edit edition")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="editionTitle"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Edition title")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="editionSummary"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Edition summary")}
                      </FormLabel>
                      <FormControl>
                        <Editor
                          disabled={isPending}
                          apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                          init={{
                            ...editorPlugin,
                            skin: theme === "dark" ? "oxide-dark" : undefined,
                            content_css: theme === "dark" ? "dark" : undefined,
                            width: "100%",
                            language: locale,
                          }}
                          onEditorChange={field.onChange}
                          value={field.value}
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
                        ISBN
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
                  name="editionNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Edition number")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
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
                        {t("Page count")}
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
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Language")}
                        <span className="ml-1 text-xl font-bold leading-none text-transparent">
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
                  name="publicationYear"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Publication year")}
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
                  name="estimatedPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Estimated price")}
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
                  name="publisher"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Publisher")}
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
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Book format")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[EBookFormat.PAPERBACK, EBookFormat.HARD_COVER].map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {t(option)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shelfId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Shelf")}</FormLabel>

                      <ShelfSelector
                        onChange={field.onChange}
                        initShelfName={edition.shelf?.shelfNumber}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row justify-start gap-6">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          disableImageField && "cursor-not-allowed"
                        )}
                      >
                        <FormLabel
                          className={cn(
                            disableImageField &&
                              "pointer-events-none cursor-not-allowed opacity-60"
                          )}
                        >
                          <div>
                            {t("Cover image")} (&lt;10MB)
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
                          </div>
                          {field.value ? (
                            <div
                              className={cn(
                                "group relative mt-2 flex size-64 items-center justify-center rounded-md border-2",
                                isPending && "pointer-events-none opacity-80"
                              )}
                            >
                              <Image
                                src={field.value}
                                alt="imageUrl"
                                width={168}
                                height={252}
                                className="rounded-md object-contain group-hover:opacity-90"
                              />
                              <Button
                                onClick={(e) => {
                                  e.preventDefault()
                                  field.onChange("")
                                  form.setValue(`file`, undefined)
                                }}
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2"
                              >
                                <Trash2 className="text-danger" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "mt-2 flex size-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed",
                                isPending && "pointer-events-none opacity-80"
                              )}
                            >
                              <UploadIcon className="size-12" />
                              <p>{t("Upload")}</p>
                            </div>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="file"
                            accept="image/*"
                            placeholder="Add profile photo"
                            className="hidden"
                            onChange={(e) =>
                              handleImageChange(e, field.onChange)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "You need to enter title, publisher, authors before uploading cover image"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col">
                    <Label className="mb-1">
                      {t("Check cover image result")}
                      <span className="ml-1 text-xl font-bold leading-none text-transparent">
                        *
                      </span>
                    </Label>

                    {checkingImage && (
                      <div className="flex items-center">
                        {t("Checking")}
                        <Loader2 className="size-4 animate-spin" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 text-sm">
                      {!checkingImage &&
                        (watchValidImage === undefined ? (
                          <div>{t("Not checked yet")}</div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <strong>{t("Result")}</strong>
                            <div>
                              {t(watchValidImage ? "Passed" : "Failed")}
                            </div>
                            <div>
                              {watchValidImage ? (
                                <Check className="text-success" />
                              ) : (
                                <X className="text-danger" />
                              )}
                            </div>
                          </div>
                        ))}
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCheckImage()
                        }}
                        disabled={!canCheck}
                        size="sm"
                        className="w-fit"
                      >
                        {t("Check")}
                      </Button>
                      {watchFile && !checkingImage && checkedResult && (
                        <>
                          <div className="flex items-center gap-2">
                            <strong>{t("Average point")}</strong>
                            <div>{checkedResult.totalPoint.toFixed(2)}/100</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            {checkedResult.fieldPoints.map((field) => {
                              const fieldName = field.name.includes("Author")
                                ? t("Author") + " " + field.name.split(" ")[1]
                                : t(field.name)

                              return (
                                <div
                                  key={field.name}
                                  className="flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground"
                                >
                                  <div className="flex items-center gap-2">
                                    <strong>{fieldName}:</strong>
                                    <div>{field.detail}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <strong>{t("Matched point")}</strong>
                                    <div>{field.matchedPoint}/100</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

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
                    {t("Save")}
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

export default UpdateEditionDialog
