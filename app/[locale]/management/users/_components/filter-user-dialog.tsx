"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type TUserRole } from "@/queries/users/get-user-roles"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { formUrlQuery } from "@/lib/utils"
import {
  usersFilterSchema,
  type TUsersFilterSchema,
} from "@/lib/validations/user/user-filter"
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

import FilterDateUser from "./filter-date-user"

type Props = {
  userRoles: TUserRole[]
}

function FilterUsersDialog({ userRoles }: Props) {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const form = useForm<TUsersFilterSchema>({
    resolver: zodResolver(usersFilterSchema),
    defaultValues: {
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      gender: "Male",
      dobRange: ["", ""],
      modifiedDateRange: ["", ""],
      createDateRange: ["", ""],
    },
  })

  const resetFilters = () => {
    form.setValue("firstName", "")
    form.setValue("lastName", "")
    form.setValue("gender", "Male")
    form.setValue("dobRange", ["", ""])
    form.setValue("modifiedDateRange", ["", ""])
    form.setValue("createDateRange", ["", ""])
  }

  const onSubmit = async (values: TUsersFilterSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        dobRange: values.dobRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
        modifiedDateRange: values.modifiedDateRange.map((date) =>
          date ? format(new Date(date), "yyyy-MM-dd") : ""
        ),
        createDateRange: values.createDateRange.map((date) =>
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
          <DialogTitle>{t("filter.user")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
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

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.gender")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("placeholder.gender")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FilterDateUser
                  form={form}
                  label="fields.dob"
                  name="dobRange"
                />

                <FilterDateUser
                  form={form}
                  label="fields.createDate"
                  name="createDateRange"
                />

                <FilterDateUser
                  form={form}
                  label="fields.updatedDate"
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

export default FilterUsersDialog
