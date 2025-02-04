"use client"

import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { FileUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { type TSearchBookEditionsSchema } from "@/lib/validations/books/search-book-editions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type Props = {
  searchParams: TSearchBookEditionsSchema
}

const ExportButton = ({ searchParams }: Props) => {
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportBook = () => {
    startTransition(async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/management/library-items/export`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
            searchParams,
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
        a.download = "Books.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Books:", error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      className=""
      onClick={handleExportBook}
      disabled={isPending}
    >
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
    </Button>
  )
}

export default ExportButton
