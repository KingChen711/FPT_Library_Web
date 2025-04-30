"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EClosureType } from "@/lib/types/enums"
import { type ClosureDay } from "@/lib/types/models"
import {
  mutateClosureDaySchema,
  type TMutateClosureDaySchema,
} from "@/lib/validations/closure-days/mutate-closure-day"
import { createClosureDay } from "@/actions/closure-days/create-closure-day"
import { updateClosureDay } from "@/actions/closure-days/update-closure-day"
import { toast } from "@/hooks/use-toast"
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

type Props = {
  type: "create" | "update"
  closureDay?: ClosureDay
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      closureDay: ClosureDay
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutateClosureDayDialog({
  type,
  openEdit,
  setOpenEdit,
  closureDay,
}: Props) {
  const t = useTranslations("ClosureDaysManagementPage")
  const tClosureDay = useTranslations("Badges.ClosureType")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    if (type === "create") {
      setOpen(value)
      return
    }
    setOpenEdit(value)
  }

  const form = useForm<TMutateClosureDaySchema>({
    resolver: zodResolver(mutateClosureDaySchema),
    defaultValues: {
      day: type === "update" ? closureDay.day : undefined,
      month: type === "update" ? closureDay.month : undefined,
      year: type === "update" ? closureDay.year || undefined : undefined,
      engDescription: type === "update" ? closureDay.engDescription : "",
      vieDescription: type === "update" ? closureDay.vieDescription : "",
      type:
        type === "update"
          ? closureDay.year
            ? EClosureType.FIXED
            : EClosureType.ANNUAL
          : EClosureType.ANNUAL,
    },
  })

  const closureType = form.watch("type")

  const onSubmit = async (values: TMutateClosureDaySchema) => {
    startTransition(async () => {
      if (values.type === EClosureType.ANNUAL) values.year = undefined
      const res =
        type === "create"
          ? await createClosureDay(values)
          : await updateClosureDay({
              ...values,
              closureDayId: closureDay.closureDayId,
            })
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        if (type === "create") {
          setOpen(false)
        } else {
          setOpenEdit(false)
        }

        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog
      open={type === "create" ? open : openEdit}
      onOpenChange={handleOpenChange}
    >
      {type === "create" && (
        <DialogTrigger asChild>
          <Button className="flex items-center justify-end gap-x-1 leading-none">
            <Plus />
            <div>{t("Create closure day")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(type === "create" ? "Create closure day" : "Edit closure day")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Closure day type")}</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[EClosureType.ANNUAL, EClosureType.FIXED].map(
                            (option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tClosureDay(option.toString())}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Day")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Month")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {closureType === EClosureType.FIXED && (
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t("Year")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="engDescription"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("English name")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vieDescription"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Vietnamese name")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
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
                    {t(type === "create" ? "Create" : "Save")}{" "}
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

export default MutateClosureDayDialog
