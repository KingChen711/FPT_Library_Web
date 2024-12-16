"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Trash } from "lucide-react"
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

type EmployeeFilterGenderProps = {
  handleAddTextSearchParams: DebouncedState<
    (key: string, value: string) => void
  >
}

const EmployeeFilterGender = ({
  handleAddTextSearchParams,
}: EmployeeFilterGenderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    searchParams.get(EmployeeFilter.GENDER)?.toString() || undefined
  )

  const handleResetSelect = (key: string) => {
    setSelectedValue(undefined)

    const params = new URLSearchParams(searchParams)
    params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Label className="w-1/4 text-nowrap">Gender</Label>
      {/* Key ensures full re-render on reset */}
      <Select
        key={selectedValue || "placeholder"} // Force re-render when value is reset
        value={selectedValue}
        onValueChange={(value) => {
          setSelectedValue(value)
          handleAddTextSearchParams(EmployeeFilter.GENDER, value)
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select a gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Trash
        size={24}
        color="red"
        className="cursor-pointer"
        onClick={() => handleResetSelect(EmployeeFilter.GENDER)}
      />
    </div>
  )
}

export default EmployeeFilterGender
