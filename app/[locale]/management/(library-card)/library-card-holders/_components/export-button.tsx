"use client"

import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { format } from "date-fns"
import { FileUp, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { type TSearchPatronsSchema } from "@/lib/validations/patrons/search-patrons"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type Props = {
  searchParams: TSearchPatronsSchema
}
const formatDate = (d: Date) => format(d, "yyyy-MM-dd")

const ExportButton = ({ searchParams }: Props) => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const [isPending, startTransition] = useTransition()
  const { accessToken } = useAuth()

  const handleExportPatron = () => {
    startTransition(async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/management/library-items/export`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
            searchParams: {
              ...searchParams,
              cardIssueDateRange:
                JSON.stringify(searchParams.cardIssueDateRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.cardIssueDateRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
              cardExpiryDateRange:
                JSON.stringify(searchParams.cardExpiryDateRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.cardExpiryDateRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
              suspensionDateRange:
                JSON.stringify(searchParams.suspensionDateRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.suspensionDateRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
              dobRange:
                JSON.stringify(searchParams.dobRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.dobRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
            },
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
        a.download = "Patrons.xlsx"
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error exporting Patrons:", error)
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleExportPatron} disabled={isPending}>
      <FileUp size={16} /> {tGeneralManagement("btn.export")}
      {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
    </Button>
  )
}

export default ExportButton
