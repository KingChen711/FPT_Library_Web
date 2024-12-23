"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, SquarePen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  authorDialogSchema,
  type TAuthorDialogSchema,
} from "@/lib/validations/author/author-dialog"
import { createAuthor } from "@/actions/authors/create-author"
import { updateAuthor } from "@/actions/authors/update-author"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"

import AuthorDialogInput from "./author-dialog-input"

type AuthorDialogFormProps = {
  mode: "create" | "update"
  author?: TAuthorDialogSchema
  authorId?: string
}

const AuthorDialogForm = ({
  mode,
  author,
  authorId,
}: AuthorDialogFormProps) => {
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState<boolean>(false)
  const tAuthorManagement = useTranslations("AuthorManagement")
  const tGeneralManagement = useTranslations("GeneralManagement")

  const form = useForm<TAuthorDialogSchema>({
    resolver: zodResolver(authorDialogSchema),
    defaultValues: {
      authorCode: author?.authorCode ?? "",
      fullName: author?.fullName ?? "",
      dob: author?.dob ?? "",
      dateOfDeath: author?.dateOfDeath ?? "",
      nationality: author?.nationality ?? "",
      biography: author?.biography ?? "",
      authorImage: author?.authorImage ?? "",
    },
  })

  useEffect(() => {
    form.reset()
    form.clearErrors()
  }, [form, isOpen])

  const onSubmit = async (values: TAuthorDialogSchema) => {
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createAuthor(values)
          : await updateAuthor(authorId as string, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  const handleCancel = () => {
    form.reset()
    form.clearErrors()
    setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(state) => setOpen(state)}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            {tAuthorManagement("create author")}
          </Button>
        </DialogTrigger>
      )}

      {mode === "update" && author && (
        <DialogTrigger asChild>
          <div className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
            <SquarePen size={16} /> {tAuthorManagement("update author")}
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="m-0 overflow-hidden p-0 pb-4">
        <DialogHeader className="w-full space-y-4 bg-primary p-4">
          <DialogTitle className="text-center text-primary-foreground">
            {mode === "create"
              ? tAuthorManagement("create author")
              : tAuthorManagement("update author")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container h-[60vh] space-y-4 overflow-y-auto px-4"
          >
            <div className="space-y-2">
              <AuthorDialogInput
                form={form}
                fieldName="authorCode"
                pending={pending}
                formLabel={tGeneralManagement("fields.authorCode")}
                inputPlaceholder={tGeneralManagement("placeholder.code")}
              />

              <AuthorDialogInput
                form={form}
                fieldName="fullName"
                pending={pending}
                formLabel={tGeneralManagement("fields.fullName")}
                inputPlaceholder={tGeneralManagement("placeholder.fullName")}
              />

              <AuthorDialogInput
                form={form}
                fieldName="biography"
                pending={pending}
                formLabel={tGeneralManagement("fields.biography")}
                inputPlaceholder={tGeneralManagement("placeholder.biography")}
              />

              <AuthorDialogInput
                form={form}
                fieldName="nationality"
                pending={pending}
                formLabel={tGeneralManagement("fields.nationality")}
                inputPlaceholder={tGeneralManagement("placeholder.nationality")}
              />

              <AuthorDialogInput
                form={form}
                inputType="date"
                fieldName="dob"
                pending={pending}
                formLabel={tGeneralManagement("fields.dob")}
                inputPlaceholder={tGeneralManagement("placeholder.dob")}
              />

              <AuthorDialogInput
                form={form}
                inputType="date"
                fieldName="dateOfDeath"
                pending={pending}
                formLabel={tGeneralManagement("fields.dateOfDeath")}
                inputPlaceholder={tGeneralManagement("placeholder.dob")}
              />
            </div>

            <div className="flex w-full items-center justify-end gap-4">
              <Button disabled={pending} type="submit">
                {tGeneralManagement("btn.save")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={pending}
                variant={"ghost"}
              >
                {tGeneralManagement("btn.cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AuthorDialogForm
