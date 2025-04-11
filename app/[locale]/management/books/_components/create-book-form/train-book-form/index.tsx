import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type TTrainBookInProgressSchema } from "@/lib/validations/books/train-book-in-progress"
import { trainBook } from "@/actions/books/train-book"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import CoverImageField from "./cover-image-field"
import MultiImageDropzone from "./multi-images-dropzone"

type Props = {
  form: UseFormReturn<TTrainBookInProgressSchema>
  title: string
  publisher: string
  subTitle: string | null | undefined
  generalNote: string | null | undefined
  authorNames: string[]
}

function TrainBookForm({
  form,
  authorNames,
  generalNote,
  publisher,
  subTitle,
  title,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const tZod = useTranslations("Zod")
  const router = useRouter()
  const locale = useLocale()

  const { fields, append, remove } = useFieldArray({
    name: "imageList",
    control: form.control,
  })

  const imageListError = form.formState.errors.imageList?.root?.message

  const [isPending, startTransition] = useTransition()

  const onSubmit = (values: TTrainBookInProgressSchema) => {
    startTransition(async () => {
      const formData = new FormData()

      formData.append("BookCode", values.bookCode)
      values.imageList.map((image) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageList"
          render={() => (
            <FormItem>
              <FormLabel>
                {t("Cover images")} {t("min5CoverImages")}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-6">
                  <MultiImageDropzone append={append} />
                  {fields.map((field, index) => {
                    return (
                      <div
                        key={field.id}
                        className="flex flex-col gap-y-2 rounded-md border-2 py-4"
                      >
                        <div className="flex items-center justify-between gap-4 border-b-2 px-6 pb-2">
                          <div className="flex items-center gap-x-3">
                            <label className="flex items-center gap-2 font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {t("Cover image") + " " + (index + 1)}
                            </label>
                          </div>
                          <Button
                            disabled={isPending || index === 0}
                            onClick={() => {
                              URL.revokeObjectURL(field.coverImage || "")
                              remove(index)
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <Trash2 className="size-6 text-danger" />
                          </Button>
                        </div>

                        <CoverImageField
                          form={form}
                          index={index}
                          isPending={isPending}
                          authorNames={authorNames}
                          generalNote={generalNote}
                          publisher={publisher}
                          subTitle={subTitle}
                          title={title}
                        />
                      </div>
                    )
                  })}
                </div>
              </FormControl>

              {imageListError && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {tZod(imageListError)}
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-4">
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
            {t("Skip")}
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
      </form>
    </Form>
  )
}

export default TrainBookForm
