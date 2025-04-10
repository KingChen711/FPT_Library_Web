"use client"

import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EGender, EIssuanceMethod } from "@/lib/types/enums"
import { type LibraryCard } from "@/lib/types/models"
import {
  editCardSchema,
  type TEditCardSchema,
} from "@/lib/validations/patrons/cards/edit-card"
import { editCard } from "@/actions/library-card/cards/edit-card"
import useUploadImage from "@/hooks/media/use-upload-image"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  FormDescription,
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

import EditCardAvatarField from "./edit-card-avatar-field"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  card: LibraryCard
  userId: string
  isPending: boolean
}

//use to pass validate if the image not change. Not a test, hard code,...
const fakeInitCheckedResult = {
  faces: [
    {
      attributes: { age: { value: 0 }, gender: { value: EGender.MALE } },
    },
  ],
}

function EditCardDialog({ card, open, setOpen, userId }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const tIssuanceMethod = useTranslations("Badges.IssuanceMethod")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const { mutateAsync: uploadBookImage } = useUploadImage()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TEditCardSchema>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      fullName: card.fullName,
      avatar: card.avatar,
      issuanceMethod: card.issuanceMethod,
      isAllowBorrowMore: false,
      detectedFacesResult: fakeInitCheckedResult,
    },
  })

  const watchIsAllowBorrowMore = form.watch("isAllowBorrowMore")

  const onSubmit = async (values: TEditCardSchema) => {
    startTransition(async () => {
      const avatarFile = values.file

      if (avatarFile && values.avatar.startsWith("blob")) {
        const data = await uploadBookImage(avatarFile)
        if (!data) {
          toast({
            title: locale === "vi" ? "Thất bại" : "Fail",
            description:
              locale === "vi" ? "Lỗi không xác định" : "Unknown error",
            variant: "danger",
          })
          return
        }
        values.avatar = data.secureUrl
      }

      values.file = undefined

      const res = await editCard(userId, card.libraryCardId, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      //*Just do this on fail
      form.setValue("avatar", values.avatar)
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2">{t("Edit card")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <div className="flex gap-4 max-lg:flex-col">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("Full name")}
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
                    name="issuanceMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("Issuance method")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(+value)}
                          value={field.value.toString()}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(EIssuanceMethod)
                              .filter((e) => typeof e === "number")
                              .map((option) => (
                                <SelectItem
                                  key={option.toString()}
                                  value={option.toString()}
                                >
                                  {tIssuanceMethod(option.toString())}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <EditCardAvatarField form={form} isPending={isPending} />

                <FormField
                  control={form.control}
                  name="isAllowBorrowMore"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("Allow borrow more")}</FormLabel>
                        <FormDescription>
                          {t("Allow borrow more description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchIsAllowBorrowMore && (
                  <>
                    <FormField
                      control={form.control}
                      name="maxItemOnceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Max item once time")}</FormLabel>
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
                      name="allowBorrowMoreReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Allow borrow more reason")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
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

export default EditCardDialog
