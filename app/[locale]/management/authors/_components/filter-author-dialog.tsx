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
  employeesFilterSchema,
  type TEmployeesFilterSchema,
} from "@/lib/validations/employee/employees-filter"
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

function FiltersAuthorsDialog() {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const form = useForm<TEmployeesFilterSchema>({
    resolver: zodResolver(employeesFilterSchema),
    defaultValues: {
      employeeCode: searchParams.get("employeeCode") || "",
      dobRange: ["", ""],
      roleId: searchParams.get("roleId") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      gender: "All",
      isActive: "",
      hireDateRange: ["", ""],
      modifiedDateRange: ["", ""],
      createDateRange: ["", ""],
    },
  })

  const resetFilters = () => {
    form.setValue("employeeCode", "")
    form.setValue("dobRange", ["", ""])
    form.setValue("roleId", "")
    form.setValue("firstName", "")
    form.setValue("lastName", "")
    form.setValue("gender", "All")
    form.setValue("isActive", "")
    form.setValue("hireDateRange", ["", ""])
    form.setValue("modifiedDateRange", ["", ""])
    form.setValue("createDateRange", ["", ""])
  }

  const onSubmit = async (values: TEmployeesFilterSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        employeeCode: values.employeeCode,
        roleId: values.roleId,
        firstName: values.firstName,
        lastName: values.lastName,
        isActive: values.isActive,
        gender: values.gender,
        createdDateRange: values.createDateRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
        modifiedDateRange: values.modifiedDateRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
        hireDateRange: values.hireDateRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
        dobRange: values.dobRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
      },
    })
    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full rounded-l-none" variant="outline">
          <Filter />
          {t("filter.title")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("filter.employee")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.employeeCode")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholder.code")} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.firstName")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.lastName")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
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
