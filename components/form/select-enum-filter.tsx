"use client"

import React from "react"
import { useLocale } from "next-intl"

import { FormControl } from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props = {
  value: string | undefined
  onChange: (val: string | undefined) => void
  enumObj: Record<string, string | number>
  tEnum: (key: string) => string
  noAll?: boolean
  stringEnum?: boolean
}

function SelectEnumFilter({
  onChange,
  value,
  enumObj,
  tEnum,
  noAll = false,
  stringEnum = false,
}: Props) {
  const locale = useLocale()

  return (
    <Select
      value={value !== undefined ? value : "All"}
      onValueChange={(val) => onChange(val === "All" ? undefined : val)}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {!noAll && (
          <SelectItem value="All">
            {locale === "vi" ? "Tất cả" : "All"}
          </SelectItem>
        )}
        {Object.values(enumObj)
          .filter((value) => (stringEnum ? true : typeof value === "number"))
          .map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {tEnum(option.toString())}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default SelectEnumFilter
