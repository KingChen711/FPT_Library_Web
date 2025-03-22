import React from "react"
import { useLocale } from "next-intl"

import { FormControl, FormItem, FormLabel } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

type Props = {
  value: boolean | undefined
  onChange: (val: boolean | undefined) => void
}

function BooleanFilter({ onChange, value }: Props) {
  const locale = useLocale()
  return (
    <RadioGroup
      onValueChange={(val) => {
        onChange(val === "all" ? undefined : val === "1")
      }}
      defaultValue={value === undefined ? "all" : value ? "1" : "0"}
      className="flex flex-row gap-4"
    >
      <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="all" />
        </FormControl>
        <FormLabel className="font-normal">
          {locale === "vi" ? "Tất cả" : "All"}
        </FormLabel>
      </FormItem>
      <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="1" />
        </FormControl>
        <FormLabel className="font-normal">
          {" "}
          {locale === "vi" ? "Có" : "Yes"}
        </FormLabel>
      </FormItem>
      <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="0" />
        </FormControl>
        <FormLabel className="font-normal">
          {" "}
          {locale === "vi" ? "Không" : "No"}
        </FormLabel>
      </FormItem>
    </RadioGroup>
  )
}

export default BooleanFilter
