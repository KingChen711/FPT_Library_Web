"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Package } from "@/lib/types/models"
import {
  mutateLibraryPackageSchema,
  type TMutateLibraryPackageSchema,
} from "@/lib/validations/library-packages/mutate-library-package"
import { createLibraryPackage } from "@/actions/library-packages/create-library-package"
import { updateLibraryPackage } from "@/actions/library-packages/update-library-package"
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
import { Textarea } from "@/components/ui/textarea"

type Props = {
  type: "create" | "update"
  libraryPackage?: Package
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | { type: "create" }
  | {
      type: "update"
      libraryPackage: Package
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutatePackageDialog({
  type,
  libraryPackage,
  openEdit,
  setOpenEdit,
}: Props) {
  const locale = useLocale()
  const t = useTranslations("LibraryPackagesManagementPage")
  const tGeneral = useTranslations("GeneralManagement")
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<TMutateLibraryPackageSchema>({
    resolver: zodResolver(mutateLibraryPackageSchema),
    defaultValues: {
      packageName: type === "update" ? libraryPackage.packageName : "",
      price: type === "update" ? libraryPackage.price : 2000,
      durationInMonths: type === "update" ? libraryPackage.durationInMonths : 1,
      description: type === "update" ? (libraryPackage.description ?? "") : "",
    },
  })

  useEffect(() => {
    form.reset()
    form.clearErrors()
  }, [form, openEdit, open])

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    if (type === "create") {
      setOpen(value)
      return
    }
    setOpenEdit(value)
  }

  const onSubmit = async (values: TMutateLibraryPackageSchema) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    startTransition(async () => {
      const res =
        type === "create"
          ? await createLibraryPackage(values)
          : await updateLibraryPackage(
              libraryPackage.libraryCardPackageId,
              values
            )
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
        form.reset()
        form.clearErrors()
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
            <div>{t("Create package")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(type === "create" ? "Create package" : "Edit package")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="packageName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("package name")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral("placeholder.package name")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("package price")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2000}
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral("placeholder.package price")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationInMonths"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("package duration")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral("placeholder.package duration")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("package description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isPending}
                          {...field}
                          placeholder={tGeneral(
                            "placeholder.package description"
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

export default MutatePackageDialog
