"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const EmployeeExport = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportEmployee = () => {
    startTransition(async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/management/employees/export?${searchParams.toString()}`,
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
        a.download = "Employees.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Employees:", error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      className=""
      onClick={handleExportEmployee}
      disabled={isPending}
    >
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
    </Button>
  )
}

export default EmployeeExport
