import { useEffect, useState, type SetStateAction } from "react"
import { editorPlugin } from "@/constants"
import { Editor } from "@tinymce/tinymce-react"
import { Plus, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { EBookFormat } from "@/lib/types/enums"
import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TMutateBookSchema } from "@/lib/validations/books/mutate-book"
import { type TTrainBookSchema } from "@/lib/validations/books/train-book"
import useActualTheme from "@/hooks/utils/use-actual-theme"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
import { Button } from "@/components/ui/button"
import {
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

import EditionImageFields from "./edition-image-fields"

type Props = {
  form: UseFormReturn<TTrainBookSchema>
  isPending: boolean
}

function EditionImagesFields({ form, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")
  const { fields } = useFieldArray({
    name: "editionImages",
    control: form.control,
  })

  return (
    <>
      {fields.map((field, index) => {
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`editionImages.${index}`}
            render={() => (
              <FormItem>
                <FormLabel>
                  {t("Edition")} {index + 1}
                </FormLabel>
                <FormControl>
                  <EditionImageFields
                    index={index}
                    form={form}
                    isPending={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </>
  )
}

export default EditionImagesFields
