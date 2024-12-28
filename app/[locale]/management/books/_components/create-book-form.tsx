"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import {
  mutateBookSchema,
  type TMutateBookSchema,
} from "@/lib/validations/books/mutate-book"
import { createBook } from "@/actions/books/create-book"
import { uploadMedias } from "@/actions/books/upload-medias"
import useCategories from "@/hooks/categories/use-categories"
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
import { Textarea } from "@/components/ui/textarea"

import BookEditionFields, { createBookEdition } from "./book-edition-fields"
import BookResourceFields from "./book-resource-fields"
import { ProgressTabBar } from "./progress-stage-bar"

// const TABS = ["General", "Resources", "Editions"] as const
type Tab = "General" | "Resources" | "Editions"

function CreateBookForm() {
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const [currentTab, setCurrentTab] = useState<Tab>("General")

  const { data: categoryItems } = useCategories()
  const [openCategoriesCombobox, setOpenCategoriesCombobox] = useState(false)

  const form = useForm<TMutateBookSchema>({
    resolver: zodResolver(mutateBookSchema),
    defaultValues: {
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

      console.log(values)

      const res = await createBook(values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        router.push("/management/books")

        return
      }

      if (res.typeError === "form") {
        if (
          Object.keys(res.fieldErrors).some((key) =>
            ["title", "subTitle", "summary", "categoryIds"].includes(key)
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
        }
      }
      handleServerActionError(res, locale, form)
    })
  }

  const triggerGeneralTab = async () => {
    const results = await Promise.all([
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
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <h3 className="text-2xl font-semibold">{t("Create book")}</h3>
        </div>
        <ProgressTabBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>

      {/* <div className="flex gap-1 border-b-2">
        {TABS.map((tab) => (
          <div
            key={tab}
            className={cn(
              "w-40 cursor-pointer rounded-t-md bg-primary px-2 py-1 text-center text-primary-foreground opacity-60",
              tab === currentTab && "cursor-default opacity-100"
            )}
            onClick={() => setCurrentTab(tab)}
          >
            {t(tab)}
          </div>
        ))}
      </div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {currentTab === "General" && (
            <>
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
                      <Textarea disabled={isPending} {...field} />
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
                      <BookEditionFields form={form} isPending={isPending} />
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
                  console.log("preventDefault")

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
    </div>
  )
}

export default CreateBookForm
