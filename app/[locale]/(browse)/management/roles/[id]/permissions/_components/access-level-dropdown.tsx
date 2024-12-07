"use client"

import React, { useState } from "react"
import {
  BanIcon,
  Check,
  ChevronsUpDown,
  EyeIcon,
  PencilIcon,
  PlusCircleIcon,
  StarIcon,
} from "lucide-react"

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

const levelList = [
  { ICon: () => <StarIcon />, label: "Full access", value: "1" },
  { ICon: () => <EyeIcon />, label: "View", value: "2" },
  { ICon: () => <PlusCircleIcon />, label: "Create", value: "3" },
  { ICon: () => <PencilIcon />, label: "Modify", value: "4" },
  { ICon: () => <BanIcon />, label: "Access denied", value: "5" },
]

function AccessLevelDropdown() {
  const [level, setLevel] = useState("1")
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-[200px] justify-between",
            !level && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-x-2">
            {level
              ? levelList.find((item) => item.value === level)?.ICon()
              : null}
            {level
              ? levelList.find((item) => item.value === level)?.label
              : "Select level"}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {levelList.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setLevel(item.value)
                  }}
                  className="cursor-pointer"
                >
                  <item.ICon />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      item.value === level ? "opacity-100" : "opacity-0"
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

export default AccessLevelDropdown
