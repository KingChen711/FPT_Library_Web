"use client"

import React, { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { cn } from "@/lib/utils"

import { Button } from "./button"

type Props = {
  value: string
  options?: JsBarcode.Options & {
    containerWidth?: number
    containerHeight?: number
    rounded?: boolean
  }
}

const BarcodeGenerator = ({ value, options }: Props) => {
  const barcodeRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  const barcodesPrintRef = useRef<HTMLDivElement>(null)

  const handlePrintBarcodes = useReactToPrint({
    contentRef: barcodesPrintRef,
  })

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        ...options,
      })
      setMounted(true)
    }
  }, [value, options])

  const rounded = options?.rounded === undefined ? true : options.rounded

  return (
    <div
      ref={barcodesPrintRef}
      style={{
        width: options?.containerWidth && `${options.containerWidth}px`,
        height: options?.containerHeight && `${options.containerHeight}px`,
      }}
      className={cn(
        "group relative flex w-fit justify-center overflow-hidden rounded-md border bg-white",
        !rounded && "rounded-none"
      )}
    >
      <Button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handlePrintBarcodes()
        }}
        size="icon"
        variant="outline"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 group-hover:inline-flex"
      >
        <Printer className="text-primary" />
      </Button>
      <svg
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={cn(
          !mounted &&
            `hidden ${options?.height ? `h-[${options.height}px]` : ""}`
        )}
        ref={barcodeRef}
      ></svg>
    </div>
  )
}

export default BarcodeGenerator
