"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { type Supplier } from "@/lib/types/models"
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

import SupplierCard from "./supplier-card"

type Props = {
  suppliers: Supplier[]
}

const orderByOptions = [
  { label: "A-Z", value: "A-Z" },
  { label: "Z-A", value: "Z-A" },
]

function SupplierList({ suppliers }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const t = useTranslations("SuppliersManagementPage")
  const [orderBy, setOrderBy] = useState<string>("A-Z")
  const [open, setOpen] = useState(false)

  const filteredSuppliers = suppliers
    .filter(
      (supplier) =>
        (supplier.address &&
          supplier.address
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (supplier.city &&
          supplier.city
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (supplier.contactEmail &&
          supplier.contactEmail
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (supplier.contactPerson &&
          supplier.contactPerson
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (supplier.contactPhone &&
          supplier.contactPhone
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (supplier.country &&
          supplier.country
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        supplier.supplierName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    )
    .toSorted((a, b) => {
      switch (orderBy) {
        case "A-Z":
          a.supplierName.localeCompare(b.supplierName)

        case "Z-A":
          b.supplierName.localeCompare(a.supplierName)
        case "Id ascending":
          return a.supplierId - b.supplierId
        default:
          return b.supplierId - a.supplierId
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
      {filteredSuppliers.length === 0 && (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Suppliers Not Found")}
            description={t(
              "No suppliers matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.supplierId} supplier={supplier} />
        ))}
      </div>
    </>
  )
}

export default SupplierList
