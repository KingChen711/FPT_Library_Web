import React from "react"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TTrainGroupsSchema } from "@/lib/validations/books/train-groups"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"

import BookImageFields from "./train-ai-book-image-fields"

type Props = {
  form: UseFormReturn<TTrainGroupsSchema>
  groupIndex: number
  isPending: boolean
  booksData: {
    authors: string[]
    generalNote: string | null
    publisher: string
    subTitle: string | null
    title: string
  }[]
  setCurrentBookIndex: React.Dispatch<React.SetStateAction<number>>
  currentBookIndex: number
  hashes: Set<string>
}

function GroupField({
  form,
  groupIndex,
  isPending,
  booksData,
  setCurrentBookIndex,
  currentBookIndex,
  hashes,
}: Props) {
  const t = useTranslations("BooksManagementPage")

  const { fields } = useFieldArray({
    name: `groups.${groupIndex}.books`,
    control: form.control,
  })

  return (
    <FormField
      control={form.control}
      name={`groups.${groupIndex}.books`}
      render={() => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col gap-2">
                <Label> {t("Library item")}</Label>
                <div className="flex flex-wrap items-center gap-4">
                  {fields.map((field, index) => {
                    const imageList = form.watch(
                      `groups.${groupIndex}.books.${index}.imageList`
                    )
                    const isDone =
                      imageList.length >= 5 &&
                      imageList.every((image) => image.validImage)

                    return (
                      <div
                        key={field.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-md border p-3",
                          index === currentBookIndex &&
                            "cursor-default border-primary"
                        )}
                        onClick={() => {
                          setCurrentBookIndex(index)
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="text-sm font-bold text-muted-foreground">
                            {field.title}
                          </div>
                          <div className="text-xs font-bold text-muted-foreground">
                            ISBN: {field.isbn}
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "size-6 text-success",
                            !isDone && "invisible"
                          )}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              {fields.map((field, index) => {
                if (index !== currentBookIndex) return null

                return (
                  <BookImageFields
                    hashes={hashes}
                    key={field.id}
                    form={form}
                    groupIndex={groupIndex}
                    bookIndex={index}
                    isPending={isPending}
                    authorNames={booksData[index].authors}
                    generalNote={booksData[index].generalNote}
                    publisher={booksData[index].publisher}
                    subTitle={booksData[index].subTitle}
                    title={booksData[index].title}
                  />
                )
              })}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default GroupField
