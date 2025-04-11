"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Check,
  ChevronsUpDown,
  MoveHorizontalIcon,
  MoveVerticalIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const layouts = [
  {
    value: "false",
    label: "Role horizontal",
  },
  {
    value: "true",
    label: "Role vertical",
  },
]

function RoleLayoutDropdown() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const isRoleVerticalLayout = searchParams.get("isRoleVerticalLayout")
  const [value, setValue] = useState(
    searchParams.get("isRoleVerticalLayout") === "true" ? "true" : "false"
  )
  const router = useRouter()
  const t = useTranslations("RoleManagement")

  useEffect(() => {
    setValue(isRoleVerticalLayout === "true" ? "true" : "false")
  }, [isRoleVerticalLayout])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-x-2">
            {value === "false" ? <MoveHorizontalIcon /> : <MoveVerticalIcon />}
            {value
              ? t(layouts.find((layout) => layout.value === value)?.label)
              : "Select layout..."}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {layouts.map((layout) => (
                <CommandItem
                  key={layout.value}
                  value={layout.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    router.push(
                      `/management/permissions?isRoleVerticalLayout=${currentValue}`
                    )
                  }}
                  className="cursor-pointer"
                >
                  {layout.value === "false" ? (
                    <MoveHorizontalIcon />
                  ) : (
                    <MoveVerticalIcon />
                  )}
                  {t(layout.label)}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === layout.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default RoleLayoutDropdown
