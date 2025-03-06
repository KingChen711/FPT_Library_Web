import React, { useState } from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { parsedMarc21 } from "@/lib/parse-marc21"
import { type TCreateTrackingManualSchema } from "@/lib/validations/trackings/create-tracking-manual"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  form: UseFormReturn<TCreateTrackingManualSchema>
  index: number
}

function Marc21Dialog({ form, index }: Props) {
  const [marc21, setMarc21] = useState("")
  const locale = useLocale()
  const t = useTranslations("BooksManagementPage")
  const [showError, setShowError] = useState(false)
  const [open, setOpen] = useState(false)

  const handleParseMarc21 = () => {
    try {
      const marc21Data = parsedMarc21(marc21)
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.title`,
        marc21Data.title
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.subTitle`,
        marc21Data.subTitle
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.responsibility`,
        marc21Data.responsibility
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.edition`,
        marc21Data.edition
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.language`,
        marc21Data.language
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.originLanguage`,
        marc21Data.originLanguage
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.summary`,
        marc21Data.summary
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.publicationPlace`,
        marc21Data.publicationPlace
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.publisher`,
        marc21Data.publisher
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.publicationYear`,
        marc21Data.publicationYear
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.classificationNumber`,
        marc21Data.classificationNumber
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.cutterNumber`,
        marc21Data.cutterNumber
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.isbn`,
        marc21Data.isbn
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.ean`,
        marc21Data.ean
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.estimatedPrice`,
        marc21Data.estimatedPrice
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.pageCount`,
        marc21Data.pageCount
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.physicalDetails`,
        marc21Data.physicalDetails
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.dimensions`,
        marc21Data.dimensions
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.accompanyingMaterial`,
        marc21Data.accompanyingMaterial
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.genres`,
        marc21Data.genres
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.generalNote`,
        marc21Data.generalNote
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.bibliographicalNote`,
        marc21Data.bibliographicalNote
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.topicalTerms`,
        marc21Data.topicalTerms
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.additionalAuthors`,
        marc21Data.additionalAuthors
      )
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.author`,
        marc21Data.author
      )
      setOpen(false)
    } catch {
      setShowError(true)
    } finally {
      setMarc21("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("Copy catalog")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Copy catalog")}</DialogTitle>
          <DialogDescription>
            <Label>Marc21</Label>
            <Textarea
              value={marc21}
              onChange={(e) => {
                setMarc21(e.target.value)
                setShowError(false)
              }}
              rows={8}
              className="mt-2"
              placeholder={t("Enter marc21")}
            />
            <Button asChild variant="link" className="px-0">
              <Link target="_blank" href="/guides/marc21">
                {t("Copy cataloging guide")}
              </Link>
            </Button>
            {showError && (
              <p className="text-sm leading-none text-danger">
                {locale === "vi" ? "Marc21 không hợp lệ" : "Invalid Marc21"}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-4">
              <DialogClose>
                <Button variant="outline">{t("Cancel")}</Button>
              </DialogClose>

              <Button disabled={!marc21} onClick={handleParseMarc21}>
                {t("Continue")}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default Marc21Dialog
