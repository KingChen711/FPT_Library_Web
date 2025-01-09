"use client"

import React, {
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useRouter } from "next/navigation"
import { editorPlugin } from "@/constants"
import { useScanIsbn } from "@/stores/use-scan-isnb"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { Check, Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  mutateBookSchema,
  type TMutateBookSchema,
} from "@/lib/validations/books/mutate-book"
import { createBook, type TCreateBookRes } from "@/actions/books/create-book"
import { uploadMedias } from "@/actions/books/upload-medias"
import useSearchIsbn from "@/hooks/books/use-search-isbn"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import IsbnScannerDialog from "@/components/ui/isbn-scanner-dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ScannedBook from "@/components/ui/scanned-book"

import TrainAIForm from "../train-ai-form"
import BookEditionFields, { createBookEdition } from "./book-edition-fields"
import BookResourceFields from "./book-resource-fields"
import { ProgressTabBar } from "./progress-stage-bar"

type Tab = "General" | "Resources" | "Editions" | "Train AI"

function CreateBookForm() {
  const { isbn } = useScanIsbn()
  const { data: scannedBook, isFetching: isFetchingSearchIsbn } =
    useSearchIsbn(isbn)
  const theme = useActualTheme()
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const [currentTab, setCurrentTab] = useState<Tab>("General")
  const [currentEditionIndex, setCurrentEditionIndex] = useState(0)

  const { data: categoryItems } = useCategories()
  const [openCategoriesCombobox, setOpenCategoriesCombobox] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])

  const [trainAIData, setTrainAIData] = useState<TCreateBookRes | null>(null)

  const form = useForm<TMutateBookSchema>({
    resolver: zodResolver(mutateBookSchema),
    defaultValues: {
      bookCode: "",
      title: "",
      subTitle: "",
      summary: "",
      categoryIds: [],
      bookResources: [],
      bookEditions: [createBookEdition()],
    },
  })

  const onSubmit = async (values: TMutateBookSchema) => {
    startTransition(async () => {
      await uploadMedias(values)

      const res = await createBook(values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })

        setTrainAIData(res.data)
        setCurrentTab("Train AI")
        return
      }

      if (res.typeError === "form") {
        if (
          Object.keys(res.fieldErrors).some((key) =>
            [
              "bookCode",
              "title",
              "subTitle",
              "summary",
              "categoryIds",
            ].includes(key)
          )
        ) {
          setCurrentTab("General")
        } else if (
          Object.keys(res.fieldErrors).some((key) =>
            key.startsWith("bookResources")
          )
        ) {
          setCurrentTab("Resources")
        } else {
          setCurrentTab("Editions")

          const keyBookEditions = Object.keys(res.fieldErrors).find((key) =>
            key.startsWith("bookEditions")
          )
          if (keyBookEditions) {
            setCurrentEditionIndex(
              +keyBookEditions.split("bookEditions[")[1][0]
            )
          }

          const indexToMessage = new Map<number, string>()
          Object.keys(res.fieldErrors)
            .filter(
              (key) =>
                key.startsWith("bookEditions") && key.includes("bookCopies")
            )
            .forEach((key, i) => {
              const index = +key.split("bookEditions[")[1][0]
              const val = indexToMessage.get(index) || ""
              indexToMessage.set(
                index,
                val + (i !== 0 ? ", " : "") + res.fieldErrors[key][0]
              )
              delete res.fieldErrors[key]
            })

          indexToMessage.forEach((value, key) => {
            form.setError(`bookEditions.${key}.bookCopies`, { message: value })
          })
        }
      }

      handleServerActionError(res, locale, form)
    })
  }

  const triggerGeneralTab = async () => {
    const results = await Promise.all([
      form.trigger("bookCode"),
      form.trigger("title"),
      form.trigger("subTitle"),
      form.trigger("summary"),
      form.trigger("categoryIds"),
    ])

    const trigger = results.every((res) => res)

    if (!trigger) setCurrentTab("General")

    return trigger
  }

  const triggerBookResourcesTab = async () => {
    const results = await Promise.all([form.trigger("bookResources")])

    const trigger = results.every((res) => res)

    if (!trigger) setCurrentTab("Resources")

    return trigger
  }

  const triggerBookEditionsTab = async () => {
    const results = await Promise.all([form.trigger("bookEditions")])

    const trigger = results.every((res) => res)

    if (!trigger) setCurrentTab("Editions")

    return trigger
  }

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">{t("Create book")}</h3>
          <IsbnScannerDialog />
        </div>

        <ProgressTabBar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab as Dispatch<SetStateAction<string>>}
        />
      </div>

      {isFetchingSearchIsbn && (
        <div className="flex items-center gap-2">
          {t("Loading scanned book")}
          <Loader2 className="size-4 animate-spin" />{" "}
        </div>
      )}

      {scannedBook && (
        <div className="mt-4 flex flex-col gap-2">
          <Label>{t("Scanned book")}</Label>
          {scannedBook.notFound ? (
            <div className="text-sm">{t("not found isbn", { isbn })}</div>
          ) : (
            <ScannedBook book={scannedBook} />
          )}
        </div>
      )}

      {currentTab !== "Train AI" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-6"
          >
            {currentTab === "General" && (
              <>
                <FormField
                  control={form.control}
                  name="bookCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="flex items-center">
                        {t("Book code")}
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
                        {form.getValues("categoryIds").map((categoryId) => (
                          <div
                            key={categoryId}
                            className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-sm text-card-foreground"
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
                                  {categoryItems?.map((category) => (
                                    <CommandItem
                                      key={category.categoryId}
                                      disabled={form
                                        .getValues("categoryIds")
                                        .includes(category.categoryId)}
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

                                      {form
                                        .getValues("categoryIds")
                                        .includes(category.categoryId) && (
                                        <Check />
                                      )}
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
              </>
            )}

            {currentTab === "Resources" && (
              <>
                <FormField
                  control={form.control}
                  name="bookResources"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t("Book resources")}</FormLabel>
                      <FormControl>
                        <BookResourceFields form={form} isPending={isPending} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentTab === "Editions" && (
              <>
                <FormField
                  control={form.control}
                  name="bookEditions"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        {t("Book editions")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <BookEditionFields
                          selectedAuthors={selectedAuthors}
                          setSelectedAuthors={setSelectedAuthors}
                          currentEditionIndex={currentEditionIndex}
                          setCurrentEditionIndex={setCurrentEditionIndex}
                          form={form}
                          isPending={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-x-4">
              <Button
                disabled={isPending}
                variant="secondary"
                className="float-right mt-4"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (currentTab !== "General") {
                    setCurrentTab(
                      currentTab === "Editions" ? "Resources" : "General"
                    )
                    return
                  }
                  router.push("/management/books")
                }}
              >
                {t(currentTab !== "General" ? "Back" : "Cancel")}
              </Button>

              <Button
                disabled={isPending}
                type="submit"
                className="float-right mt-4"
                onClick={async (e) => {
                  if (currentTab !== "Editions") {
                    e.preventDefault()
                    e.stopPropagation()
                  }

                  if (currentTab === "General") {
                    if (await triggerGeneralTab()) {
                      setCurrentTab("Resources")
                    }
                    return
                  }

                  if (currentTab === "Resources") {
                    if (
                      (await triggerGeneralTab()) &&
                      (await triggerBookResourcesTab())
                    ) {
                      setCurrentTab("Editions")
                    }
                    return
                  }

                  if (
                    !(await triggerGeneralTab()) ||
                    !(await triggerBookResourcesTab()) ||
                    !(await triggerBookEditionsTab())
                  ) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
              >
                {t(currentTab !== "Editions" ? "Continue" : "Create")}{" "}
                {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentTab === "Train AI" && <TrainAIForm trainAIData={trainAIData!} />}
    </div>
  )
}

export default CreateBookForm
