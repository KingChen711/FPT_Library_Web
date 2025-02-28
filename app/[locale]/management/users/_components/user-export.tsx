"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const UserExport = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportUser = () => {
    startTransition(async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/management/users/export?${searchParams.toString()}`,
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
        a.download = "Users.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Users:", error)
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleExportUser} disabled={isPending}>
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
      {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
    </Button>
  )
}

export default UserExport
