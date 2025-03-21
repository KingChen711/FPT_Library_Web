import React, { useState } from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { parsedMarc21 } from "@/lib/parse-marc21"
import { type TAddTrackingDetailSchema } from "@/lib/validations/trackings/add-tracking-detail"
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
  form: UseFormReturn<TAddTrackingDetailSchema>
}

function Marc21Dialog({ form }: Props) {
  const [marc21, setMarc21] = useState("")
  const locale = useLocale()
  const t = useTranslations("BooksManagementPage")
  const [showError, setShowError] = useState(false)
  const [open, setOpen] = useState(false)

  const handleParseMarc21 = () => {
    try {
      const marc21Data = parsedMarc21(marc21)
      form.setValue(`libraryItem.title`, marc21Data.title)
      form.setValue(`libraryItem.subTitle`, marc21Data.subTitle)
      form.setValue(`libraryItem.responsibility`, marc21Data.responsibility)
      form.setValue(`libraryItem.edition`, marc21Data.edition)
      if (marc21Data.language)
        form.setValue(`libraryItem.language`, marc21Data.language)
      form.setValue(`libraryItem.originLanguage`, marc21Data.originLanguage)
      form.setValue(`libraryItem.summary`, marc21Data.summary)
      form.setValue(`libraryItem.publicationPlace`, marc21Data.publicationPlace)
      form.setValue(`libraryItem.publisher`, marc21Data.publisher)
      if (marc21Data.publicationYear)
        form.setValue(`libraryItem.publicationYear`, marc21Data.publicationYear)
      form.setValue(
        `libraryItem.classificationNumber`,
        marc21Data.classificationNumber
      )
      form.setValue(`libraryItem.cutterNumber`, marc21Data.cutterNumber)
      form.setValue(`libraryItem.isbn`, marc21Data.isbn)
      form.setValue(`libraryItem.ean`, marc21Data.ean)
      form.setValue(`libraryItem.estimatedPrice`, marc21Data.estimatedPrice)
      if (marc21Data.pageCount)
        form.setValue(`libraryItem.pageCount`, marc21Data.pageCount)
      form.setValue(`libraryItem.physicalDetails`, marc21Data.physicalDetails)
      if (marc21Data.dimensions)
        form.setValue(`libraryItem.dimensions`, marc21Data.dimensions)
      form.setValue(
        `libraryItem.accompanyingMaterial`,
        marc21Data.accompanyingMaterial
      )
      form.setValue(`libraryItem.genres`, marc21Data.genres)
      form.setValue(`libraryItem.generalNote`, marc21Data.generalNote)
      form.setValue(
        `libraryItem.bibliographicalNote`,
        marc21Data.bibliographicalNote
      )
      form.setValue(`libraryItem.topicalTerms`, marc21Data.topicalTerms)
      form.setValue(
        `libraryItem.additionalAuthors`,
        marc21Data.additionalAuthors
      )
      form.setValue(`libraryItem.author`, marc21Data.author)
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
