"use client"

import React, { useState, useTransition } from "react"
import defaultAuthorAvatar from "@/public/assets/images/default-author.png"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useDebounce } from "use-debounce"
import { type z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  bookEditionAddAuthorsSchema,
  type TBookEditionAddAuthorsSchema,
} from "@/lib/validations/books/book-editions/add-authors"
import { addAuthors } from "@/actions/books/editions/add-authors"
import useSearchAuthors from "@/hooks/authors/use-search-authors"
import { toast } from "@/hooks/use-toast"
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
import ImageWithFallback from "@/components/ui/image-with-fallback"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  bookId: number
  editionId: number
  currentIds: number[]
}

function AddAuthorsDialog({
  bookId,
  editionId,
  currentIds: initCurrentIds,
}: Props) {
  const t = useTranslations("BooksManagementPage")

  const [open, setOpen] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const [openPopover, setOpenPopover] = useState(false)

  const currentIds = [
    ...initCurrentIds,
    ...selectedAuthors.map((a) => a.authorId),
  ]

  const { data: authorItems, isFetching } =
    useSearchAuthors(debouncedSearchTerm)

  const form = useForm<z.infer<typeof bookEditionAddAuthorsSchema>>({
    resolver: zodResolver(bookEditionAddAuthorsSchema),
    defaultValues: {
      authorIds: [],
    },
  })

  function onSubmit(values: TBookEditionAddAuthorsSchema) {
    startTransition(async () => {
      const res = await addAuthors({ ...values, bookId, editionId })
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("Add authors")}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Add authors")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="authorIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t("Authors")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <div className="flex flex-wrap items-center gap-3 rounded-[6px] border px-3 py-2">
                        {form.getValues("authorIds").map((authorId) => {
                          const author = selectedAuthors?.find(
                            (t) => t.authorId === authorId
                          )
                          if (!author) return null
                          return (
                            <div
                              key={authorId}
                              className="relative flex w-60 gap-x-3 rounded-md border p-3 text-sm"
                            >
                              <ImageWithFallback
                                alt="author"
                                height={40}
                                width={40}
                                src={author.authorImage || defaultAuthorAvatar}
                                fallbackSrc={defaultAuthorAvatar}
                                className="size-10 rounded-full border"
                              />

                              <div className="flex w-full flex-col">
                                <h4 className="line-clamp-1 w-[85%] font-bold">
                                  {author.fullName || "Author"}
                                </h4>
                                <p className="line-clamp-1 text-xs">
                                  {author.authorCode} - {author.nationality}
                                </p>
                              </div>

                              <X
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (isPending) return
                                  form.setValue(
                                    "authorIds",
                                    form
                                      .getValues("authorIds")
                                      .filter((t) => t !== authorId)
                                  )
                                }}
                                className="absolute right-2 top-2 size-4 cursor-pointer"
                              />
                            </div>
                          )
                        })}
                        <Popover
                          open={openPopover}
                          onOpenChange={setOpenPopover}
                        >
                          <PopoverTrigger asChild disabled={isPending}>
                            <FormControl>
                              <Button
                                disabled={isPending}
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "w-60 justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {t("Select author")}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-0">
                            <Command>
                              <CommandInput
                                placeholder={t("Search")}
                                className="h-9"
                                value={searchTerm}
                                onValueChange={(val) => setSearchTerm(val)}
                              />
                              <CommandList>
                                {searchTerm !== "" &&
                                  searchTerm === debouncedSearchTerm &&
                                  !isFetching &&
                                  authorItems?.length === 0 && (
                                    <CommandEmpty>
                                      {t("No author found")}
                                    </CommandEmpty>
                                  )}
                                <CommandGroup>
                                  {isFetching && (
                                    <CommandItem className="flex justify-center">
                                      <Loader2 className="size-4 animate-spin" />
                                    </CommandItem>
                                  )}
                                </CommandGroup>
                              </CommandList>
                              <div className="flex max-h-[90%] w-full flex-col overflow-y-auto overflow-x-hidden">
                                {authorItems?.map((author) => (
                                  <div
                                    key={author.authorId}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setSelectedAuthors((prev) => {
                                        if (
                                          prev.find(
                                            (t) =>
                                              t.authorId === author.authorId
                                          )
                                        )
                                          return prev

                                        return [...prev, author]
                                      })

                                      form.setValue(
                                        "authorIds",
                                        Array.from(
                                          new Set([
                                            ...form.getValues("authorIds"),
                                            author.authorId,
                                          ])
                                        )
                                      )
                                      setOpenPopover(false)
                                      setSearchTerm("")
                                    }}
                                    className={cn(
                                      "relative flex w-60 cursor-pointer gap-x-3 p-3 text-sm hover:opacity-60",
                                      currentIds.includes(author.authorId) &&
                                        "pointer-events-none"
                                    )}
                                  >
                                    <ImageWithFallback
                                      alt="author"
                                      height={40}
                                      width={40}
                                      src={
                                        author.authorImage ||
                                        defaultAuthorAvatar
                                      }
                                      fallbackSrc={defaultAuthorAvatar}
                                      className="size-10 rounded-full border"
                                    />

                                    <div className="flex w-full flex-col">
                                      <h4 className="line-clamp-1 w-[85%] font-bold">
                                        {author.fullName || "Author"}
                                      </h4>
                                      <p className="line-clamp-1 text-xs">
                                        {author.authorCode}-{author.nationality}
                                      </p>
                                    </div>

                                    {currentIds.includes(author.authorId) && (
                                      <Check />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end gap-4">
                  <DialogClose asChild disabled={isPending}>
                    <Button disabled={isPending} variant="outline">
                      {t("Cancel")}
                    </Button>
                  </DialogClose>
                  <Button disabled={isPending} type="submit">
                    {t("Save")}{" "}
                    {isPending && <Loader2 className="size-4 animate-spin" />}
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

export default AddAuthorsDialog
