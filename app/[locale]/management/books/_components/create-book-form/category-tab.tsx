"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import useCategories from "@/hooks/categories/use-categories"
import { Button } from "@/components/ui/button"
import CategoryCard, {
  CategoryCardSkeleton,
} from "@/components/ui/category-card"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import NoData from "@/components/ui/no-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  selectedCategory: Category | null
  show: boolean
  setSelectedCategory: (val: Category) => void
}

const orderByOptions = [
  { label: "A-Z", value: "A-Z" },
  { label: "Z-A", value: "Z-A" },
  { label: "Id ascending", value: "Id ascending" },
  { label: "Id descending", value: "Id descending" },
]

function CategoryTab({
  form,
  selectedCategory,
  show,
  setSelectedCategory,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const locale = useLocale()
  const t = useTranslations("CategoriesManagementPage")
  const [orderBy, setOrderBy] = useState<string>("A-Z")
  const [open, setOpen] = useState(false)

  const { data: categories } = useCategories()

  const filteredCategories =
    categories
      ?.filter(
        (category) =>
          (locale === "vi" ? category.vietnameseName : category.englishName)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          category.prefix
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      )
      .toSorted((a, b) => {
        switch (orderBy) {
          case "A-Z":
            return locale === "vi"
              ? a.vietnameseName.localeCompare(b.vietnameseName)
              : a.englishName.localeCompare(b.englishName)
          case "Z-A":
            return locale === "vi"
              ? b.vietnameseName.localeCompare(a.vietnameseName)
              : b.englishName.localeCompare(a.englishName)
          case "Id ascending":
            return a.categoryId - b.categoryId
          default:
            return b.categoryId - a.categoryId
        }
      }) || []

  if (!show) return null

  return (
    <>
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              {t("Category")}{" "}
              <span className="ml-1 text-xl font-bold leading-none text-primary">
                *
              </span>
            </FormLabel>

            {selectedCategory ? (
              <div className="grid grid-cols-12 gap-4">
                <CategoryCard
                  category={selectedCategory}
                  disabledContext
                  className="border border-primary"
                />
                <div className="col-span-12 h-full flex-1 rounded-md bg-card text-sm sm:col-span-6 lg:col-span-3">
                  <div
                    className="select-none"
                    dangerouslySetInnerHTML={{
                      __html: t.markup("category prefix note", {
                        prefix: () =>
                          `<strong>${selectedCategory.prefix}</strong>`,
                      }),
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("Select a category")}
              </p>
            )}

            <FormMessage />

            <div className="mb-4 flex items-center gap-4">
              <div className="flex flex-1 items-center rounded-md border py-1 pl-3">
                <Search className="size-5" />
                <Input
                  className="border-none outline-none focus-visible:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("Search")}
                />
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-[46px] w-[220px] justify-between"
                  >
                    {t("Sort by")}:{" "}
                    {orderBy
                      ? t(
                          orderByOptions.find(
                            (option) => option.value === orderBy
                          )?.label
                        )
                      : "Select option..."}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup className="">
                        {orderByOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              setOrderBy(
                                currentValue === orderBy ? "" : currentValue
                              )
                              setOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                orderBy === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {t(option.label)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {categories === undefined &&
                [...Array(8)].map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              {categories !== undefined && filteredCategories.length === 0 && (
                <div className="col-span-12 flex w-full justify-center">
                  <NoData />
                </div>
              )}
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.categoryId}
                  category={category}
                  disabledContext
                  onClick={() => {
                    field.onChange(category.categoryId)
                    setSelectedCategory(category)
                    form.clearErrors("categoryId")
                  }}
                  className={cn(
                    "cursor-pointer hover:border hover:border-primary",
                    selectedCategory?.categoryId === category.categoryId &&
                      "pointer-events-auto cursor-default opacity-50 hover:border-border"
                  )}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </>
  )
}

export default CategoryTab
