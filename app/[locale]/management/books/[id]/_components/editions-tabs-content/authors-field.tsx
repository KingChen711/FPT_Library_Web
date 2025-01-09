"use client"

import React, { useState } from "react"
import defaultAuthorAvatar from "@/public/assets/images/default-author.png"
import { Loader2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TCreateEditionSchema } from "@/lib/validations/books/book-editions/create-edition"
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
import ImageWithFallback from "@/components/ui/image-with-fallback"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  form: UseFormReturn<TCreateEditionSchema>
  isPending: boolean
  selectedAuthors: Author[]
  setSelectedAuthors: React.Dispatch<React.SetStateAction<Author[]>>
}

//TODO:fix author image

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

  const { data: authorItems, isFetching } =
    useSearchAuthors(debouncedSearchTerm)

  return (
    <FormField
      control={form.control}
      name={`authorIds`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {t("Authors")}
            <span className="ml-1 text-xl font-bold leading-none text-primary">
              *
            </span>
          </FormLabel>
          <div className="flex flex-wrap items-center gap-3 rounded-[6px] border px-3 py-2">
            {form.getValues(`authorIds`).map((authorId) => {
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
                    src={author.authorImage}
                    fallbackSrc={defaultAuthorAvatar}
                    className="size-10 shrink-0 rounded-full border"
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
                    onClick={() => {
                      if (isPending) return
                      form.setValue(
                        `authorIds`,
                        form
                          .getValues(`authorIds`)
                          .filter((t) => t !== authorId)
                      )
                    }}
                    className="absolute right-2 top-2 size-4 cursor-pointer"
                  />
                </div>
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
                  <div className="flex max-h-[90%] w-full flex-col overflow-y-auto overflow-x-hidden">
                    {authorItems?.map((author) => (
                      <div
                        key={author.authorId}
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
                                ...form.getValues(`authorIds`),
                                author.authorId,
                              ])
                            )
                          )
                          setOpen(false)
                          setSearchTerm("")
                        }}
                        className="relative flex w-60 cursor-pointer gap-x-3 p-3 text-sm hover:opacity-60"
                      >
                        <ImageWithFallback
                          alt="author"
                          height={40}
                          width={40}
                          src={author.authorImage}
                          fallbackSrc={defaultAuthorAvatar}
                          className="size-10 shrink-0 rounded-full border"
                        />

                        <div className="flex w-full flex-col">
                          <h4 className="line-clamp-1 w-[85%] font-bold">
                            {author.fullName || "Author"}
                          </h4>
                          <p className="line-clamp-1 text-xs">
                            {author.authorCode}-{author.nationality}
                          </p>
                        </div>
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
  )
}

export default AuthorsField
