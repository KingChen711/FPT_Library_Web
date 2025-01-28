import React from "react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import BookResourceFields from "./book-resource-fields"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  show: boolean
}

function ResourcesTab({ form, isPending, show }: Props) {
  const t = useTranslations("BooksManagementPage")

  if (!show) return null

  return (
    <FormField
      control={form.control}
      name="libraryResources"
      render={() => (
        <FormItem>
          <FormLabel>{t("Book resources")}</FormLabel>
          <FormControl>
            <BookResourceFields form={form} isPending={isPending} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default ResourcesTab
