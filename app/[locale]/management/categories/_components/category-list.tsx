"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import NoResult from "@/components/ui/no-result"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import CategoryCard from "../../../../../components/ui/category-card"

type Props = {
  categories: Category[]
}

const orderByOptions = [
  { label: "A-Z", value: "A-Z" },
  { label: "Z-A", value: "Z-A" },
]

function CategoryList({ categories }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const locale = useLocale()
  const t = useTranslations("CategoriesManagementPage")
  const [orderBy, setOrderBy] = useState<string>("A-Z")
  const [open, setOpen] = useState(false)

  const filteredCategories = categories
    .filter(
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
    })

  return (
    <>
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
                    orderByOptions.find((option) => option.value === orderBy)
                      ?.label
                  )
                : "Select option..."}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {orderByOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setOrderBy(currentValue)
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          orderBy === option.value ? "opacity-100" : "opacity-0"
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
      {filteredCategories.length === 0 && (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Categories Not Found")}
            description={t(
              "No categories matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        {filteredCategories.map((category) => (
          <CategoryCard key={category.categoryId} category={category} />
        ))}
      </div>
    </>
  )
}

export default CategoryList
