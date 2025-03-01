"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { type Role } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import RoleCard from "./role-card"

type Props = {
  roles: Role[]
}

const orderByOptions = [
  { label: "A-Z", value: "A-Z" },
  { label: "Z-A", value: "Z-A" },
]

function RoleList({ roles }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const locale = useLocale()
  const t = useTranslations("RoleManagement")
  const [orderBy, setOrderBy] = useState<string>("A-Z")
  const [open, setOpen] = useState(false)

  const filteredRoles = roles
    .filter((role) =>
      (locale === "vi" ? role.vietnameseName : role.englishName)
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
          return a.roleId - b.roleId
        default:
          return b.roleId - a.roleId
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
                ? orderByOptions.find((option) => option.value === orderBy)
                    ?.label
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
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {filteredRoles.map((role) => (
          <RoleCard key={role.roleId} role={role} />
        ))}
      </div>
    </>
  )
}

export default RoleList
