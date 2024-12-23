"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { type DebouncedState } from "use-debounce"

import { EmployeeFilter } from "@/lib/validations/employee/employees-filter"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type EmployeeFilterRoleId = {
  handleAddTextSearchParams: DebouncedState<
    (key: string, value: string) => void
  >
}

const EmployeeFilterRoleId = ({
  handleAddTextSearchParams,
}: EmployeeFilterRoleId) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tGeneralManagement = useTranslations("GeneralManagement")
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    searchParams.get(EmployeeFilter.ROLE_ID)?.toString() || undefined
  )

  const handleResetSelect = (key: string) => {
    setSelectedValue(undefined)

    const params = new URLSearchParams(searchParams)
    params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Label className="w-1/4 text-nowrap">
        {tGeneralManagement("fields.role")}
      </Label>
      {/* TODO: Fetch role from API */}
      <Select
        key={selectedValue || "placeholder"} // Force re-render when value is reset
        value={selectedValue}
        onValueChange={(value) => {
          setSelectedValue(value)
          handleAddTextSearchParams(EmployeeFilter.ROLE_ID, value)
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={tGeneralManagement("placeholder.role")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="5">HeadLibrarian</SelectItem>
            <SelectItem value="6">LibraryManager</SelectItem>
            <SelectItem value="7">LibraryAssistant</SelectItem>
            <SelectItem value="8">Librarian</SelectItem>
            <SelectItem value="9">TemporaryWorker</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Trash
        size={24}
        color="red"
        className="cursor-pointer"
        onClick={() => handleResetSelect(EmployeeFilter.ROLE_ID)}
      />
    </div>
  )
}

export default EmployeeFilterRoleId
