"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Condition } from "@/lib/types/models"
import {
  mutateConditionSchema,
  type TMutateConditionSchema,
} from "@/lib/validations/condition/mutate-condition"
import { createCondition } from "@/actions/condition/create-condition"
import { updateCondition } from "@/actions/condition/update-condition"
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

type Props = {
  type: "create" | "update"
  condition?: Condition
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      condition: Condition
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutateConditionDialog({
  type,
  condition,
  openEdit,
  setOpenEdit,
}: Props) {
  const locale = useLocale()
  const t = useTranslations("ConditionsManagementPage")
  const tGeneral = useTranslations("GeneralManagement")
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

  const form = useForm<TMutateConditionSchema>({
    resolver: zodResolver(mutateConditionSchema),
    defaultValues: {
      englishName: type === "update" ? condition.englishName : "",
      vietnameseName: type === "update" ? condition.vietnameseName : "",
    },
  })

  const onSubmit = async (values: TMutateConditionSchema) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    startTransition(async () => {
      const res =
        type === "create"
          ? await createCondition(values)
          : await updateCondition(condition.conditionId, values)
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
            <div>{t("Create condition")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(type === "create" ? "Create condition" : "Edit condition")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("condition english name")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral(
                            "placeholder.english condition name"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vietnameseName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("condition vietnamese name")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral(
                            "placeholder.vietnamese condition name"
                          )}
                        />
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
                    {t(type === "create" ? "Create" : "Save")}
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

export default MutateConditionDialog
