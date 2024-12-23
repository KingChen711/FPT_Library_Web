"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Trash } from "lucide-react"

import { type EmployeeFilter } from "@/lib/validations/employee/employees-filter"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type EmployeeFilterInputProps = {
  label: string
  placeholder: string
  enumField: EmployeeFilter
  handleAddTextSearchParams: (key: string, value: string) => void
  handleDeleteSearchParam: (key: string) => void
}
const EmployeeFilterInput = ({
  label,
  placeholder,
  enumField: field,
  handleAddTextSearchParams,
  handleDeleteSearchParam,
}: EmployeeFilterInputProps) => {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get(field)?.toString() || ""
  )

  return (
    <div className="flex items-center gap-4">
      <Label className="w-1/4 text-nowrap">{label}</Label>
      <Input
        className="flex-1"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value
          setSearchTerm(value)
          handleAddTextSearchParams(field, value)
        }}
      />
      <Trash
        size={24}
        color="red"
        onClick={() => {
          handleDeleteSearchParam(field)
          setSearchTerm("")
        }}
      />
    </div>
  )
}

export default EmployeeFilterInput
