"use client"

import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const ExportButton = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportSupplier = () => {
    startTransition(async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/management/suppliers/export`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
          }
        )

        if (data.size == 0) {
          toast({
            title: tGeneralManagement("error"),
            description: tGeneralManagement("fileEmptyMessage"),
            variant: "danger",
          })
          return
        }

        const url = URL.createObjectURL(data)
        const a = document.createElement("a")
        a.href = url
        a.download = "Suppliers.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Suppliers:", error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleExportSupplier}
      disabled={isPending}
    >
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
      {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
    </Button>
  )
}

export default ExportButton
