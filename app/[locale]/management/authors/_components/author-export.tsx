"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { httpBlob } from "@/lib/http-blob"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const AuthorExport = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportAuthor = () => {
    startTransition(async () => {
      try {
        const res = await httpBlob.get<Blob>(
          `/api/management/authors/export?${searchParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
          }
        )

        if (res.size == 0) {
          toast({
            title: tGeneralManagement("error"),
            description: tGeneralManagement("fileEmptyMessage"),
            variant: "danger",
          })
          return
        }

        const url = URL.createObjectURL(res)
        const a = document.createElement("a")
        a.href = url
        a.download = "Authors.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Authors:", error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      className="bg-primary-foreground"
      onClick={handleExportAuthor}
      disabled={isPending}
    >
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
    </Button>
  )
}

export default AuthorExport
