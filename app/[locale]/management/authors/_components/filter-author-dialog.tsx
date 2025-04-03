"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { formUrlQuery } from "@/lib/utils"
import {
  authorsFilterSchema,
  type TAuthorsFilterSchema,
} from "@/lib/validations/author/authors-filter"
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

import FilterDateAuthor from "./filter-date-author"

function FiltersAuthorsDialog() {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const form = useForm<TAuthorsFilterSchema>({
    resolver: zodResolver(authorsFilterSchema),
    defaultValues: {
      authorCode: searchParams.get("authorCode") || "",
      dobRange: ["", ""],
      nationality: searchParams.get("nationality") || "",
      dateOfDeathRange: ["", ""],
      createDateRange: ["", ""],
      modifiedDateRange: ["", ""],
    },
  })

  const resetFilters = () => {
    form.setValue("authorCode", "")
    form.setValue("dobRange", ["", ""])
    form.setValue("nationality", "")
    form.setValue("dateOfDeathRange", ["", ""])
    form.setValue("createDateRange", ["", ""])
    form.setValue("modifiedDateRange", ["", ""])
  }

  const onSubmit = async (values: TAuthorsFilterSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        authorCode: values.authorCode,
        nationality: values.nationality,
        dobRange: values.dobRange.map((date) =>
          date ? format(new Date(date), "dd-MM-yyyy") : ""
        ),
        dateOfDeathRange: values.dateOfDeathRange.map((date) =>
          date ? format(new Date(date), "dd-MM-yyyy") : ""
        ),
        createDateRange: values.createDateRange.map((date) =>
          date ? format(new Date(date), "dd-MM-yyyy") : ""
        ),
        modifiedDateRange: values.modifiedDateRange.map((date) =>
          date ? format(new Date(date), "dd-MM-yyyy") : ""
        ),
      },
    })
    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-l-none" variant="outline">
          <Filter />
          {t("filter.title")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("filter.author")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="authorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.authorCode")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholder.code")} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.nationality")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.nationality")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FilterDateAuthor
                  form={form}
                  label="fields.dob"
                  name="dobRange"
                />

                <FilterDateAuthor
                  form={form}
                  label="fields.dateOfDeathRange"
                  name="dateOfDeathRange"
                />

                <FilterDateAuthor
                  form={form}
                  label="fields.createDateRange"
                  name="createDateRange"
                />

                <FilterDateAuthor
                  form={form}
                  label="fields.modifiedDateRange"
                  name="modifiedDateRange"
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button variant="secondary" className="float-right mt-4">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="secondary"
                    className="float-right mt-4"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      resetFilters()
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" className="float-right mt-4">
                    Apply
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

export default FiltersAuthorsDialog
