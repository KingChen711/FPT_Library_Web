"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ESupplierType } from "@/lib/types/enums"
import { type Supplier } from "@/lib/types/models"
import {
  mutateSupplierSchema,
  type TMutateSupplierSchema,
} from "@/lib/validations/suppliers/mutate-supplier"
import { createSupplier } from "@/actions/suppliers/create-supplier"
import { updateSupplier } from "@/actions/suppliers/update-supplier"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Props = {
  type: "create" | "update"
  supplier?: Supplier
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      supplier: Supplier
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutateSupplierDialog({
  type,
  supplier,
  openEdit,
  setOpenEdit,
}: Props) {
  const t = useTranslations("SuppliersManagementPage")
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

  const form = useForm<TMutateSupplierSchema>({
    resolver: zodResolver(mutateSupplierSchema),
    defaultValues: {
      supplierName: type === "update" ? supplier.supplierName || "" : "",
      supplierType:
        type === "update"
          ? supplier.supplierType || ESupplierType.PUBLISHER
          : ESupplierType.PUBLISHER,
      address: type === "update" ? supplier.address || undefined : undefined,
      city: type === "update" ? supplier.city || undefined : undefined,
      contactEmail:
        type === "update" ? supplier.contactEmail || undefined : undefined,
      contactPerson:
        type === "update" ? supplier.contactPerson || undefined : undefined,
      contactPhone:
        type === "update" ? supplier.contactPhone || undefined : undefined,
      country: type === "update" ? supplier.country || undefined : undefined,
    },
  })

  const onSubmit = async (values: TMutateSupplierSchema) => {
    startTransition(async () => {
      const res =
        type === "create"
          ? await createSupplier(values)
          : await updateSupplier(supplier.supplierId, values)
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
            <div>{t("Create supplier")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {t(type === "create" ? "Create supplier" : "Edit supplier")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>
                        {t("Supplier name")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        {t("Supplier type")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => field.onChange(+val)}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                checked={
                                  field.value === ESupplierType.PUBLISHER
                                }
                                value={ESupplierType.PUBLISHER.toString()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t("Publisher")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                checked={
                                  field.value === ESupplierType.DISTRIBUTOR
                                }
                                value={ESupplierType.DISTRIBUTOR.toString()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t("Distributor")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Contact person")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Contact email")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Contact phone")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Country")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("City")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Address")}</FormLabel>
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

export default MutateSupplierDialog
