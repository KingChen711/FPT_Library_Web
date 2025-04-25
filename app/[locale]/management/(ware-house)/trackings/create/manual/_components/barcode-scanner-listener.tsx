"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import useBarcodeScanner from "@/hooks/use-barcode-scanner"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Props = {
  onScan: (data: string) => void
}

export default function BarcodeScannerListener({ onScan }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const [isListening, setIsListening] = useState(false)

  // Handle window blur event to deactivate the listener when the window loses focus
  useEffect(() => {
    const handleBlur = () => {
      if (isListening) {
        setIsListening(false)
        console.log("Barcode scanner listener deactivated due to window blur")
      }
    }

    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("blur", handleBlur)
    }
  }, [isListening])

  const handleScan = (data: string) => {
    if (!isListening) return
    onScan(data)
  }

  useBarcodeScanner(handleScan)

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <div
            className={`mr-2 size-2 rounded-full ${isListening ? "bg-success" : "bg-muted"}`}
          ></div>
          <Label htmlFor="scanner-mode" className="font-medium">
            {t("Scan item")}
          </Label>
        </div>
      </div>
      <Switch
        id="scanner-mode"
        checked={isListening}
        onCheckedChange={setIsListening}
        aria-label="Toggle barcode scanner listener"
      />
    </div>
  )
}
