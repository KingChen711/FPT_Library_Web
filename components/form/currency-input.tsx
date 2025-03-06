"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number
  onChange?: (value: number | undefined) => void
  error?: boolean
  className?: string
}

export function CurrencyInput({
  value,
  onChange,
  error,
  className,
  disabled,
  ...props
}: CurrencyInputProps) {
  // Format number to VND string
  const formatValue = React.useCallback((num: number | undefined) => {
    if (!num) return ""
    return num.toLocaleString("vi-VN")
  }, [])

  // Parse VND string to number
  const parseValue = (str: string) => {
    const num = Number(str.replace(/[.,đ₫\s]/g, ""))
    return isNaN(num) ? undefined : num
  }

  const [displayValue, setDisplayValue] = React.useState(formatValue(value))

  // Update display value when prop value changes
  React.useEffect(() => {
    setDisplayValue(formatValue(value))
  }, [value, formatValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replaceAll(".", "")

    if (input.length > 15) return

    // Only allow numbers and separators
    if (!/^[0-9.,\s]*$/.test(input)) {
      return
    }

    setDisplayValue(input)

    const parsedValue = parseValue(input)
    onChange?.(parsedValue)
  }

  const handleBlur = () => {
    // Reformat on blur
    setDisplayValue(formatValue(value))
  }

  return (
    <Input
      {...props}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className={cn("", error && "border-destructive", className)}
    />
  )
}
