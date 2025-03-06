"use client"

import React, { useTransition } from "react"
import { type PatronDetail } from "@/queries/patrons/get-patron"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  editPatronSchema,
  type TEditPatronSchema,
} from "@/lib/validations/patrons/edit-patron"
import { editPatron } from "@/actions/library-card/patrons/edit-patron"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  patron: PatronDetail
}

function EditPatronDialog({ patron, open, setOpen }: Props) {
  const timezone = getLocalTimeZone()
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TEditPatronSchema>({
    resolver: zodResolver(editPatronSchema),
    defaultValues: {
      address: patron.address || undefined,
      dob: patron.dob ? new Date(patron.dob) : undefined,
      firstName: patron.firstName || undefined,
      lastName: patron.lastName || undefined,
      gender: patron.gender || undefined,
      phone: patron.phone || undefined,
    },
  })

  const onSubmit = async (values: TEditPatronSchema) => {
    startTransition(async () => {
      console.log(values.dob)

      const res = await editPatron(patron.userId, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        form.reset()
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Edit patron")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <div className="flex gap-4 max-lg:flex-col">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("First name")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("Last name")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Gender")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString() || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("Select gender")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">{t("Male")}</SelectItem>
                            <SelectItem value="Female">
                              {t("Female")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 max-lg:flex-col">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Date of birth")}</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={createCalendarDate(field.value)}
                            onChange={(date) =>
                              field.onChange(
                                date ? date.toDate(timezone) : null
                              )
                            }
                            disabled={(date) => date > new Date()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("Address")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
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

export default EditPatronDialog
