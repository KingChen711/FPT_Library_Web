"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EFineType } from "@/lib/types/enums"
import { type Fine } from "@/lib/types/models"
import {
  mutateFineSchema,
  type TMutateFineSchema,
} from "@/lib/validations/fines/mutation-fine"
import { createFine } from "@/actions/fines/create-fine"
import { updateFine } from "@/actions/fines/update-fine"
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
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"

type Props = {
  type: "create" | "update"
  fine?: Fine
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      fine: Fine
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutateFineDialog({ type, fine, openEdit, setOpenEdit }: Props) {
  const t = useTranslations("FinesManagementPage")
  const tConditionType = useTranslations("Badges.FineType")
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

  const form = useForm<TMutateFineSchema>({
    resolver: zodResolver(mutateFineSchema),
    defaultValues: {
      finePolicyTitle: type === "update" ? fine.finePolicyTitle : "",
      conditionType:
        type === "update"
          ? (fine.conditionType ?? EFineType.DAMAGE)
          : EFineType.DAMAGE,
      description: type === "update" ? fine.description || "" : "",
      minDamagePct:
        type === "update"
          ? fine.minDamagePct === null
            ? undefined
            : fine.minDamagePct * 100
          : undefined,
      maxDamagePct:
        type === "update"
          ? fine.maxDamagePct === null
            ? undefined
            : fine.maxDamagePct * 100
          : undefined,
      processingFee:
        type === "update" ? (fine.processingFee ?? undefined) : undefined,
      dailyRate: type === "update" ? (fine.dailyRate ?? undefined) : undefined,
      chargePct:
        type === "update"
          ? fine.chargePct === null
            ? undefined
            : fine.chargePct * 100
          : undefined,
    },
  })

  const onSubmit = async (values: TMutateFineSchema) => {
    switch (values.conditionType) {
      case EFineType.DAMAGE:
        values.dailyRate = undefined
        break
      case EFineType.LOST:
        values.minDamagePct = undefined
        values.maxDamagePct = undefined
        values.dailyRate = undefined
        break
      case EFineType.DAMAGE:
        values.minDamagePct = undefined
        values.maxDamagePct = undefined
        values.processingFee = undefined
        values.chargePct = undefined
        break
    }

    if (values.minDamagePct) values.minDamagePct /= 100
    if (values.maxDamagePct) values.maxDamagePct /= 100
    if (values.chargePct) values.chargePct /= 100

    startTransition(async () => {
      const res =
        type === "create"
          ? await createFine(values)
          : await updateFine({ ...values, id: fine.finePolicyId })

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

  const fineType = form.watch("conditionType")

  return (
    <Dialog
      open={type === "create" ? open : openEdit}
      onOpenChange={handleOpenChange}
    >
      {type === "create" && (
        <DialogTrigger asChild>
          <Button className="flex items-center justify-end gap-x-1 leading-none">
            <Plus />
            <div>{t("Create fine")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(type === "create" ? "Create fine" : "Edit fine")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="finePolicyTitle"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Title")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Condition type")}</FormLabel>
                      <Select
                        disabled
                        value={field.value.toString()}
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(EFineType)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tConditionType(option.toString())}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Description")}</FormLabel>
                      <FormControl>
                        <Textarea disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fineType === EFineType.DAMAGE && (
                  <>
                    <FormField
                      control={form.control}
                      name="minDamagePct"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel>{t("Min damage pct")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxDamagePct"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel>{t("Max damage pct")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {fineType === EFineType.OVER_DUE ? (
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel>{t("Daily rate")}</FormLabel>
                        <FormControl>
                          <CurrencyInput disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    {" "}
                    <FormField
                      control={form.control}
                      name="chargePct"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel>{t("Charge pct")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="processingFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel>{t("Processing fee")}</FormLabel>
                          <FormControl>
                            <CurrencyInput disabled={isPending} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

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

export default MutateFineDialog
