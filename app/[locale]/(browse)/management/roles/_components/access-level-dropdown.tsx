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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const levelList = [
  {
    ICon: () => <StarIcon className="size-4" />,
    label: "Full access",
    value: "1",
  },
  { ICon: () => <EyeIcon className="size-4" />, label: "View", value: "2" },
  {
    ICon: () => <PlusCircleIcon className="size-4" />,
    label: "Create",
    value: "3",
  },
  {
    ICon: () => <PencilIcon className="size-4" />,
    label: "Modify",
    value: "4",
  },
  {
    ICon: () => <BanIcon className="size-4" />,
    label: "Access denied",
    value: "5",
  },
]

type Props = {
  initPermissionId: number
  // disabled: boolean
}

function AccessLevelDropdown({ initPermissionId }: Props) {
  const [permissionId, setPermissionId] = useState(initPermissionId)

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-w-[180px]">
          <Button variant="ghost" className="w-fit gap-x-2">
            {permissionId
              ? levelList.find((item) => +item.value === permissionId)?.ICon()
              : null}
            {permissionId
              ? levelList.find((item) => +item.value === permissionId)?.label
              : "Select level"}
          </Button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {levelList.map((item) => (
          <ContextMenuItem
            key={item.value}
            onSelect={() => {
              setPermissionId(+item.value)
            }}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <item.ICon />
            {item.label}
            <Check
              className={cn(
                "ml-auto size-4",
                +item.value === permissionId ? "opacity-100" : "opacity-0"
              )}
            />
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
  // }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-[200px] justify-between",
            !permissionId && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-x-2">
            {permissionId
              ? levelList.find((item) => +item.value === permissionId)?.ICon()
              : null}
            {permissionId
              ? levelList.find((item) => +item.value === permissionId)?.label
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
                    setPermissionId(+item.value)
                  }}
                  className="cursor-pointer"
                >
                  <item.ICon />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      +item.value === permissionId ? "opacity-100" : "opacity-0"
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
