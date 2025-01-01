"use client"

import React, { useState, useTransition } from "react"
import { editorPlugin } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Book, type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  mutateBookSchema,
  type TMutateBookSchema,
} from "@/lib/validations/books/mutate-book"
import { updateBook } from "@/actions/books/update-book"
import useCategories from "@/hooks/categories/use-categories"
import { toast } from "@/hooks/use-toast"
import useActualTheme from "@/hooks/utils/use-actual-theme"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  book: Book & { categories: Category[] }
}

function EditBookDialog({ open, setOpen, book }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const theme = useActualTheme()
  const { data: categoryItems, isLoading: isLoadingCategories } =
    useCategories()
  const [openCategoriesCombobox, setOpenCategoriesCombobox] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TMutateBookSchema>({
    resolver: zodResolver(mutateBookSchema),
    defaultValues: {
      title: book.title,
      subTitle: book.subTitle || "",
      summary: book.summary,
      categoryIds: book.categories.map((category) => category.categoryId),
    },
  })

  const onSubmit = async (values: TMutateBookSchema) => {
    startTransition(async () => {
      const res = await updateBook(book.bookId, values)
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
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Edit book")}</DialogTitle>
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
                      <FormLabel className="flex items-center">
                        {t("Title")}
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
                  name="subTitle"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Sub title")}
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
                  name="summary"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Summary")}
                      </FormLabel>
                      <FormControl>
                        <Editor
                          disabled={isPending}
                          apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                          init={{
                            ...editorPlugin,
                            skin: theme === "dark" ? "oxide-dark" : undefined,
                            content_css: theme === "dark" ? "dark" : undefined,
                            width: "100%",
                            language: locale,
                          }}
                          onEditorChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t("Categories")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <div className="flex flex-wrap items-center gap-3 rounded-[6px] border px-3 py-2">
                        {isLoadingCategories && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        {!isLoadingCategories &&
                          form.getValues("categoryIds").map((categoryId) => (
                            <div
                              key={categoryId}
                              className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground"
                              // disabled={pending}
                              // showX
                              // onClick={() => handleClickDeleteTestCategory(categoryId)}
                            >
                              {locale === "vi"
                                ? categoryItems?.find(
                                    (t) => t.categoryId === categoryId
                                  )?.vietnameseName || ""
                                : categoryItems?.find(
                                    (t) => t.categoryId === categoryId
                                  )?.englishName || ""}

                              <X
                                onClick={() => {
                                  if (isPending) return
                                  form.setValue(
                                    "categoryIds",
                                    form
                                      .getValues("categoryIds")
                                      .filter((t) => t !== categoryId)
                                  )
                                }}
                                className="size-4 cursor-pointer"
                              />
                            </div>
                          ))}
                        <Popover
                          open={openCategoriesCombobox}
                          onOpenChange={setOpenCategoriesCombobox}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={isPending}
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {t("Select category")}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search category..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {t("No category found")}
                                </CommandEmpty>
                                <CommandGroup>
                                  {isLoadingCategories && (
                                    <CommandItem>
                                      <div className="flex justify-center">
                                        <Loader2 className="size-4 animate-spin" />
                                      </div>
                                    </CommandItem>
                                  )}
                                  {categoryItems?.map((category) => (
                                    <CommandItem
                                      key={category.categoryId}
                                      onSelect={() => {
                                        form.setValue(
                                          "categoryIds",
                                          Array.from(
                                            new Set([
                                              ...form.getValues("categoryIds"),
                                              category.categoryId,
                                            ])
                                          )
                                        )
                                        setOpenCategoriesCombobox(false)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {locale === "vi"
                                        ? category.vietnameseName
                                        : category.englishName}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending || isLoadingCategories}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending || isLoadingCategories}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}{" "}
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

export default EditBookDialog
