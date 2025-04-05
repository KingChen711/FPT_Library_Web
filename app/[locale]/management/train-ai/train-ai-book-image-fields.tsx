import React from "react"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { type TTrainGroupsSchema } from "@/lib/validations/books/train-groups"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import CoverImageField from "./train-ai-cover-image-field"
import MultiImageDropzone from "./train-ai-multi-image-dropzone"

type Props = {
  groupIndex: number
  bookIndex: number
  form: UseFormReturn<TTrainGroupsSchema>
  isPending: boolean
  authorNames: string[]
  generalNote: string | null
  publisher: string
  title: string
  subTitle: string | null
  hashes: Set<string>
}

function BookImageFields({
  form,
  bookIndex,
  isPending,
  authorNames,
  generalNote,
  publisher,
  subTitle,
  title,
  groupIndex,
  hashes,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const tZod = useTranslations("Zod")

  const { fields, append, remove } = useFieldArray({
    name: `groups.${groupIndex}.books.${bookIndex}.imageList`,
    control: form.control,
  })

  const imageListError =
    form.formState.errors.groups?.[groupIndex]?.books?.[bookIndex]?.imageList
      ?.root?.message

  const isSingleBook =
    form.watch(`groups.${groupIndex}.books.${bookIndex}.type`) === "Single"

  return (
    <FormField
      control={form.control}
      name={`groups.${groupIndex}.books.${bookIndex}.imageList`}
      render={() => (
        <FormItem>
          <FormLabel>
            {t("Cover images")} {isSingleBook ? t("min5CoverImages") : null}
          </FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-6">
              <MultiImageDropzone hashes={hashes} append={append} />
              {fields.map((field, indexImage) => {
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-y-2 rounded-md border-2 py-4"
                  >
                    <div className="flex items-center justify-between gap-4 border-b-2 px-6 pb-2">
                      <div className="flex items-center gap-x-3">
                        <label className="flex items-center gap-2 font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {t("Cover image") + " " + (indexImage + 1)}
                        </label>
                      </div>
                      <Button
                        disabled={isPending || indexImage === 0}
                        onClick={() => {
                          URL.revokeObjectURL(field.coverImage || "")
                          remove(indexImage)
                        }}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="size-6 text-danger" />
                      </Button>
                    </div>

                    <CoverImageField
                      form={form}
                      bookIndex={bookIndex}
                      groupIndex={groupIndex}
                      indexImage={indexImage}
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
  )
}

export default BookImageFields
