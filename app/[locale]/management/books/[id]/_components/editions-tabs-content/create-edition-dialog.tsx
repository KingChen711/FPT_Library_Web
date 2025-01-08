"use client"

import { useState, useTransition } from "react"
import { editorPlugin } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookFormat } from "@/lib/types/enums"
import { type Author } from "@/lib/types/models"
import {
  createEditionSchema,
  type TCreateEditionSchema,
} from "@/lib/validations/books/book-editions/create-edition"
import { createEdition } from "@/actions/books/editions/create-edition"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { type TCheckCoverImageRes } from "@/hooks/books/use-check-cover-image"
import { toast } from "@/hooks/use-toast"
import useActualTheme from "@/hooks/utils/use-actual-theme"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import AuthorsField from "./authors-field"
import BookCopiesDialog from "./book-copies-dialog"
import CoverImageField from "./cover-image-field"

type Props = {
  bookId: number
}

function CreateEditionDialog({ bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const theme = useActualTheme()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const [hasConfirmedAboutChangeStatus, setHasConfirmedAboutChangeStatus] =
    useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])

  useState<TCheckCoverImageRes | null>(null)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TCreateEditionSchema>({
    resolver: zodResolver(createEditionSchema),
    defaultValues: {
      coverImage: "",
      editionNumber: 0,
      editionSummary: "",
      editionTitle: "",
      estimatedPrice: 0,
      bookFormat: EBookFormat.PAPERBACK,
      isbn: "",
      language: "",
      pageCount: 0,
      publicationYear: 0,
      publisher: "",
      authorIds: [],
      bookCopies: [],
    },
  })

  const onSubmit = async (values: TCreateEditionSchema) => {
    startTransition(async () => {
      if (values.file) {
        const res = await uploadBookImage(values.file)
        if (res) {
          values.coverImage = res.secureUrl
        }
      }

      values.file = undefined

      const res = await createEdition({
        ...values,
        bookId,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t("Create edition")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Create edition")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <div className="flex flex-wrap justify-between gap-6">
                  <FormField
                    control={form.control}
                    name={`editionTitle`}
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <div className="flex w-full flex-wrap items-center justify-between gap-4">
                          <FormLabel className="flex items-center">
                            {t("Edition title")}
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
                          </FormLabel>
                        </div>
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
                    name={`isbn`}
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
                    name={`editionNumber`}
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col items-start">
                        <FormLabel className="flex items-center">
                          {t("Edition number")}
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
                    name={`pageCount`}
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
                    name={`publicationYear`}
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
                    name={`estimatedPrice`}
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
                    name={`publisher`}
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
                    name={`language`}
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
                </div>

                <FormField
                  control={form.control}
                  name={`editionSummary`}
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col items-start">
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
                  name={`bookFormat`}
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
                  name={`bookCopies`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FormLabel>
                          {t("Book copies")}{" "}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <BookCopiesDialog
                          form={form}
                          isPending={isPending}
                          hasConfirmedAboutChangeStatus={
                            hasConfirmedAboutChangeStatus
                          }
                          setHasConfirmedAboutChangeStatus={
                            setHasConfirmedAboutChangeStatus
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
                                <strong>{t("Code")}:</strong> {bc.barcode}
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

export default CreateEditionDialog
