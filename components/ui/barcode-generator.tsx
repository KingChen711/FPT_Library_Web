"use client"

import React, { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"

import { cn } from "@/lib/utils"

type Props = {
  value: string
  options?: JsBarcode.Options
}

const BarcodeGenerator = ({ value, options }: Props) => {
  const barcodeRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        ...options,
      })
      setMounted(true)
    }
  }, [value, options])

  return (
    <svg
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={cn(
        !mounted && `hidden ${options?.height ? `h-[${options.height}px]` : ""}`
      )}
      ref={barcodeRef}
    ></svg>
  )
}

export default BarcodeGenerator
