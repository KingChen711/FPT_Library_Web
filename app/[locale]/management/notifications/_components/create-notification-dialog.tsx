"use client"

import { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ENotificationType } from "@/lib/types/enums"
import {
  createNotificationSchema,
  type TCreateNotificationSchema,
} from "@/lib/validations/notifications/create-notification"
import { createNotification } from "@/actions/notifications/create-notification"
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
  DialogTrigger,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

function CreateNotificationDialog() {
  const t = useTranslations("NotificationsManagementPage")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return

    setOpen(value)
  }

  const form = useForm<TCreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      listRecipient: [],
      isPublic: true,
      notificationType: ENotificationType.EVENT,
      createBy: "",
    },
  })

  const handleClickDeleteEmail = (email: string) => {
    form.setValue(
      "listRecipient",
      form.getValues("listRecipient").filter((t) => t !== email)
    )
  }

  const handleInputRecipientsKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "listRecipient") {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (tagValue !== "") {
        //TODO: check valid email instead of length
        // if (tagValue.length > 15) {
        //   return form.setError("listRecipient", {
        //     type: "required",
        //     message: "Tag must be less than 15 characters",
        //   })
        // }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("listRecipient", [...field.value, tagValue])
          tagInput.value = ""
          form.clearErrors("listRecipient")
        }
      } else {
        form.trigger()
      }
    }
  }

  const onSubmit = async (values: TCreateNotificationSchema) => {
    startTransition(async () => {
      const res = await createNotification({
        ...values,
        createBy: user?.email || "",
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        setOpen(false)

        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-end gap-x-1 leading-none">
          <Plus />
          <div>{t("Create notification")}</div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("Create notification")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Message")}</FormLabel>
                      <FormControl>
                        <Textarea disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notificationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Notification type")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={ENotificationType.EVENT} />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t(ENotificationType.EVENT)}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value={ENotificationType.NOTICE}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t(ENotificationType.NOTICE)}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value={ENotificationType.REMINDER}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t(ENotificationType.REMINDER)}
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
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={!field.value}
                          onCheckedChange={(val) => field.onChange(!val)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("Private notification")}</FormLabel>
                        <FormDescription>
                          {t(
                            "Notifications will be sent to the emails you specify"
                          )}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {!form.watch("isPublic") && (
                  <FormField
                    control={form.control}
                    name="listRecipient"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("Recipients")}</FormLabel>
                        <div className="flex flex-wrap items-center gap-3">
                          <Input
                            onKeyDown={(e) =>
                              handleInputRecipientsKeyDown(e, field)
                            }
                            className=""
                          />
                          {form.getValues("listRecipient").map((email) => (
                            <div
                              key={email}
                              className="flex items-center gap-x-1 rounded-md border bg-muted px-2 py-1 text-muted-foreground"
                            >
                              {email}
                              <X
                                onClick={() => handleClickDeleteEmail(email)}
                                className="size-4 cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                        <FormDescription className="mt-2">
                          {t("Add emails message")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    {t("Create")}{" "}
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

export default CreateNotificationDialog
