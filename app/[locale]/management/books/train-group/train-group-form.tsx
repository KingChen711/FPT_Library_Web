"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { type BookDetail } from "@/queries/books/get-book"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn, fileUrlToFile } from "@/lib/utils"
import {
  trainGroupSchema,
  type TTrainGroupSchema,
} from "@/lib/validations/books/train-group"
import { trainBook } from "@/actions/books/train-book"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import BookImageFields from "./book-images-fields"

type Props = {
  bookCode: string
  books: BookDetail[]
}

function TrainGroupForm({ bookCode, books }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const router = useRouter()

  const [isConvertedUrlsToFiles, setIsConvertedUrlsToFiles] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<TTrainGroupSchema>({
    resolver: zodResolver(trainGroupSchema),
    defaultValues: {
      bookCode,
      books: books.map((b) => ({
        isbn: b.isbn || "",
        title: b.title,
        imageList: [],
      })),
    },
  })

  useEffect(() => {
    const getFiles = async () => {
      try {
        const coverFiles = await Promise.all(
          books.map((b) => fileUrlToFile(b.coverImage!, b.isbn!))
        )

        coverFiles.map((file, i) =>
          form.setValue(`books.${i}.imageList`, [
            {
              coverImage: books[i].coverImage!,
              file,
              validImage: true,
            },
          ])
        )

        setIsConvertedUrlsToFiles(true)
      } catch {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Lỗi không xác định khi kiểm tra ảnh bìa"
              : "Unknown error while checking cover image",
          variant: "danger",
        })
      }
    }

    getFiles()
  }, [form, books, locale])

  const { fields } = useFieldArray({
    name: "books",
    control: form.control,
  })

  const [currentTab, setCurrentTab] = useState(fields[0].id)

  const onSubmit = (values: TTrainGroupSchema) => {
    startTransition(async () => {
      const formData = new FormData()

      formData.append("BookCode", values.bookCode)
      values.books
        .flatMap((b) => b.imageList)
        .map((image) => {
          if (!image.file) return
          formData.append("ImageList", image.file)
        })

      const res = await trainBook(formData)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push("/management/books")
        return
      }

      handleServerActionError(res, locale)
    })
  }

  useEffect(() => {
    if (
      !form.formState.errors.books ||
      !Array.isArray(form.formState.errors.books)
    )
      return

    const index = form.formState.errors.books.findIndex((b) => !!b)

    if (index !== -1) {
      setCurrentTab(fields[index].id)
    }
  }, [fields, form.formState.errors.books])

  if (!isConvertedUrlsToFiles) {
    return (
      <div className="flex w-full justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-x-4">
          <FormField
            control={form.control}
            name="books"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          className={cn(
                            "flex cursor-pointer flex-col rounded-md border p-3",
                            field.id === currentTab &&
                              "cursor-default border-primary"
                          )}
                          onClick={() => {
                            setCurrentTab(field.id)
                          }}
                        >
                          <div className="font-bold text-muted-foreground">
                            {field.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ISBN: {field.isbn}
                          </div>
                        </div>
                      ))}
                    </div>
                    {fields.map((field, index) => {
                      if (field.id !== currentTab) return null

                      return (
                        <BookImageFields
                          key={field.id}
                          form={form}
                          index={index}
                          isPending={isPending}
                          authorNames={books[index].authors.map(
                            (a) => a.fullName
                          )}
                          generalNote={books[index].generalNote}
                          publisher={books[index].publisher || ""}
                          subTitle={books[index].subTitle}
                          title={books[index].title}
                        />
                      )
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4">
            <Button
              disabled={isPending}
              variant="secondary"
              className="float-right mt-4"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push("/management/books")
              }}
            >
              {t("Cancel")}
            </Button>

            <Button
              disabled={isPending}
              type="submit"
              className="float-right mt-4"
            >
              {t("Continue")}
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default TrainGroupForm
