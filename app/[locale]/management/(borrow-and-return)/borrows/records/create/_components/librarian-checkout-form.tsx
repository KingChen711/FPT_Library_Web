"use client"

import React, { useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { EBorrowType } from "@/lib/types/enums"
import {
  librarianCheckoutSchema,
  type TLibrarianCheckoutSchema,
} from "@/lib/validations/borrow-records/librarian-checkout"
import useGetPatronByBarcode from "@/hooks/patrons/cards/use-get-patron-barcode"
import useBarcodeScanner from "@/hooks/use-barcode-scanner"
import { toast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function LibrarianCheckoutForm() {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const tStockType = useTranslations("Badges.StockTransactionType")
  const locale = useLocale()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<TLibrarianCheckoutSchema>({
    resolver: zodResolver(librarianCheckoutSchema),
    defaultValues: {
      borrowRecordDetails: [],
      borrowType: EBorrowType.TAKE_HOME,
    },
  })

  const wLibraryCardBarcode = form.watch("libraryCardBarcode")
  const wLibraryCardId = form.watch("libraryCardId")
  const wPatron = form.watch("patron")

  const { mutate: getPatronByBarcode, isPending: fetchingPatron } =
    useGetPatronByBarcode()

  useBarcodeScanner((scannedData) => {
    const scanCard = !wLibraryCardBarcode

    form.setValue("libraryCardBarcode", scannedData)

    if (scanCard) {
      if (fetchingPatron) return
      getPatronByBarcode(scannedData, {
        onSuccess: (data) => {
          if (!data) {
            toast({
              title: locale === "vi" ? "Lỗi" : "Error",
              description:
                locale === "vi" ? "Không tìm thấy bạn đọc" : "Not found patron",
              variant: "warning",
            })
            return
          }
          form.setValue("libraryCardId", data.libraryCardId)
          form.setValue("patron", data)
        },
      })
    }
  })

  const onSubmit = async (values: TLibrarianCheckoutSchema) => {}

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {(!wLibraryCardBarcode || !wLibraryCardId) && (
            <>
              <div>{t("Scan patrons card")}</div>
              <Input className="hidden" autoFocus={!wLibraryCardBarcode} />
            </>
          )}

          {wLibraryCardBarcode && (
            <>
              {fetchingPatron && (
                <div className="flex items-center">
                  Loading patron
                  <Loader2 className="ml-1 size-4 animate-spin" />
                </div>
              )}

              {wPatron && <div>have patron</div>}
            </>
          )}
        </form>
      </Form>
    </>
  )
}

export default LibrarianCheckoutForm
