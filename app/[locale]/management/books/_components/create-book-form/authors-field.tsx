"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import useSearchAuthors from "@/hooks/authors/use-search-authors"
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import NoData from "@/components/ui/no-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import CreateAuthorDialog from "../../../authors/_components/create-author-dialog"
import AuthorCard from "./author-card"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  selectedAuthors: Author[]
  setSelectedAuthors: React.Dispatch<React.SetStateAction<Author[]>>
}

function AuthorsField({
  form,
  isPending,

  selectedAuthors,
  setSelectedAuthors,
}: Props) {
  const t = useTranslations("BooksManagementPage")

  const [open, setOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [hasAutoSearch, setHasAutoSearch] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: authorItems, isFetching } =
    useSearchAuthors(debouncedSearchTerm)

  const watchAuthor = form.watch("author")

  useEffect(() => {
    if (!mounted) return
    setSearchTerm(watchAuthor || "")
    if (!watchAuthor) {
      setHasAutoSearch(true)
      return
    }
    setHasAutoSearch(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAuthor, form, setSelectedAuthors])

  useEffect(() => {
    if (!authorItems || !watchAuthor || hasAutoSearch || isFetching) return

    if (authorItems.length > 0) {
      setSelectedAuthors([authorItems[0]])
      setHasAutoSearch(true)

      form.setValue(`authorIds`, [authorItems[0].authorId])
      return
    }

    setSelectedAuthors([])
    setHasAutoSearch(true)

    form.setValue(`authorIds`, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorItems, setSelectedAuthors, form])

  useEffect(() => setMounted(true), [])

  return (
    <FormField
      control={form.control}
      name={`authorIds`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("Authors")}</FormLabel>
          <div className="flex flex-wrap items-center gap-3 rounded-[6px] border px-3 py-2">
            {form.getValues(`authorIds`)?.map((authorId) => {
              const author = selectedAuthors?.find(
                (t) => t.authorId === authorId
              )
              if (!author) return null
              return (
                <AuthorCard
                  key={author.authorId}
                  author={author}
                  onClose={() => {
                    if (isPending) return
                    form.setValue(
                      `authorIds`,
                      form.getValues(`authorIds`)?.filter((t) => t !== authorId)
                    )
                  }}
                />
              )
            })}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
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
                        <CommandEmpty>{t("No author found")}</CommandEmpty>
                      )}
                    <CommandGroup>
                      {isFetching && (
                        <CommandItem className="flex justify-center">
                          <Loader2 className="size-4 animate-spin" />
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>

                  {/* <MutateAuthorDialog type="create" /> */}
                  <CreateAuthorDialog />

                  <div className="flex max-h-[90%] w-full flex-col overflow-y-auto overflow-x-hidden">
                    {authorItems?.map((author) => (
                      <AuthorCard
                        key={author.authorId}
                        author={author}
                        onClick={() => {
                          setSelectedAuthors((prev) => {
                            if (
                              prev.find((t) => t.authorId === author.authorId)
                            )
                              return prev

                            return [...prev, author]
                          })

                          form.setValue(
                            `authorIds`,
                            Array.from(
                              new Set([
                                ...(form.getValues(`authorIds`) || []),
                                author.authorId,
                              ])
                            )
                          )
                          setOpen(false)
                          setSearchTerm("")
                        }}
                      />
                    ))}
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {t("Author infor from General tab")}
            {form.watch("author") || form.watch("additionalAuthors") || (
              <NoData className="text-[0.8rem]" />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AuthorsField
