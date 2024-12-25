"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import getEmployeeRoles, {
  type TEmployeeRole,
} from "@/queries/roles/get-employee-roles"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Filter } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn, formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const employeesFilterSchema = z.object({
  employeeCode: z.string().trim(),
  dobRange: z.array(z.date().or(z.null())),
  roleId: z.string().trim(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  gender: z.enum(["All", "Male", "Female"]),
  isActive: z.string().trim(),
  createDateRange: z.array(z.date().or(z.null())),
  modifiedDateRange: z.array(z.date().or(z.null())),
  hireDateRange: z.array(z.date().or(z.null())),
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>

type Props = {
  employeeRoles: TEmployeeRole[]
}

function FiltersEmployeesDialog({ employeeRoles }: Props) {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const form = useForm<TEmployeesFilterSchema>({
    resolver: zodResolver(employeesFilterSchema),
    defaultValues: {
      employeeCode: searchParams.get("employeeCode") || "",
      dobRange: [null, null],
      roleId: searchParams.get("roleId") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      gender: "All",
      isActive: "",
      hireDateRange: [null, null],
      modifiedDateRange: [null, null],
      createDateRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("employeeCode", "")
    form.setValue("dobRange", [null, null])
    form.setValue("roleId", "")
    form.setValue("firstName", "")
    form.setValue("lastName", "")
    form.setValue("gender", "All")
    form.setValue("isActive", "")
    form.setValue("hireDateRange", [null, null])
    form.setValue("modifiedDateRange", [null, null])
    form.setValue("createDateRange", [null, null])
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
          date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
        ),
        modifiedDateRange: values.modifiedDateRange.map((date) =>
          date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
        ),
        hireDateRange: values.hireDateRange.map((date) =>
          date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
        ),
        dobRange: values.dobRange.map((date) =>
          date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
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

                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("placeholder.role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeRoles.map((role) => (
                            <SelectItem
                              key={role.roleId}
                              value={role.roleId.toString()}
                            >
                              {locale === "en"
                                ? role.englishName
                                : role.vietnameseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dobRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.dob")}</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[0] && "text-muted-foreground"
                                )}
                              >
                                {field.value[0] ? (
                                  format(field.value[0], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[0] || undefined}
                              onSelect={(date) =>
                                field.onChange([date || null, field.value[1]])
                              }
                              disabled={(date) =>
                                !!field.value[1] &&
                                date > new Date(field.value[1])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div>-</div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[1] && "text-muted-foreground"
                                )}
                              >
                                {field.value[1] ? (
                                  format(field.value[1], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[1] || undefined}
                              onSelect={(date) =>
                                field.onChange([field.value[0], date || null])
                              }
                              disabled={(date) =>
                                !!field.value[0] &&
                                date < new Date(field.value[0])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.createDate")}</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[0] && "text-muted-foreground"
                                )}
                              >
                                {field.value[0] ? (
                                  format(field.value[0], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[0] || undefined}
                              onSelect={(date) =>
                                field.onChange([date || null, field.value[1]])
                              }
                              disabled={(date) =>
                                !!field.value[1] &&
                                date > new Date(field.value[1])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div>-</div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[1] && "text-muted-foreground"
                                )}
                              >
                                {field.value[1] ? (
                                  format(field.value[1], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[1] || undefined}
                              onSelect={(date) =>
                                field.onChange([field.value[0], date || null])
                              }
                              disabled={(date) =>
                                !!field.value[0] &&
                                date < new Date(field.value[0])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modifiedDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.updatedDate")}</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[0] && "text-muted-foreground"
                                )}
                              >
                                {field.value[0] ? (
                                  format(field.value[0], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[0] || undefined}
                              onSelect={(date) =>
                                field.onChange([date || null, field.value[1]])
                              }
                              disabled={(date) =>
                                !!field.value[1] &&
                                date > new Date(field.value[1])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div>-</div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[1] && "text-muted-foreground"
                                )}
                              >
                                {field.value[1] ? (
                                  format(field.value[1], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[1] || undefined}
                              onSelect={(date) =>
                                field.onChange([field.value[0], date || null])
                              }
                              disabled={(date) =>
                                !!field.value[0] &&
                                date < new Date(field.value[0])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hireDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.hireDate")}</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[0] && "text-muted-foreground"
                                )}
                              >
                                {field.value[0] ? (
                                  format(field.value[0], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[0] || undefined}
                              onSelect={(date) =>
                                field.onChange([date || null, field.value[1]])
                              }
                              disabled={(date) =>
                                !!field.value[1] &&
                                date > new Date(field.value[1])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div>-</div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value[1] && "text-muted-foreground"
                                )}
                              >
                                {field.value[1] ? (
                                  format(field.value[1], "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value[1] || undefined}
                              onSelect={(date) =>
                                field.onChange([field.value[0], date || null])
                              }
                              disabled={(date) =>
                                !!field.value[0] &&
                                date < new Date(field.value[0])
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
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

export default FiltersEmployeesDialog
