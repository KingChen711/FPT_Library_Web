"use client"

import React, { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { httpBlob } from "@/lib/http-blob"
import { Button } from "@/components/ui/button"

const EmployeeExport = () => {
  const t = useTranslations("UserManagement")
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { getAccessToken } = useAuth()

  const handleExportEmployee = () => {
    startTransition(async () => {
      try {
        // Gọi API trực tiếp từ frontend
        const res = await httpBlob.get<Blob>(
          `/api/management/employees/export?${searchParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
            responseType: "blob",
          }
        )

        console.log("🚀 ~ startTransition ~ res:", res)

        // Xử lý file download trên client
        // const url = URL.createObjectURL(res)
        // const a = document.createElement("a")
        // a.href = url
        // a.download = "Employees.xlsx"
        // a.click()
        // URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting employees:", error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      className="bg-primary-foreground"
      onClick={handleExportEmployee}
      disabled={isPending}
    >
      <FileUp size={16} /> {t("export")}
    </Button>
  )
}

export default EmployeeExport
