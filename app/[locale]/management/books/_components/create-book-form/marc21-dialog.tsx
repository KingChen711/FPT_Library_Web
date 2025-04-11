import React, { useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { parsedMarc21 } from "@/lib/parse-marc21"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
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
  form: UseFormReturn<TBookEditionSchema>
  show: boolean
  getIsbn: boolean
}

function Marc21Dialog({ form, show, getIsbn }: Props) {
  const [marc21, setMarc21] = useState("")
  const locale = useLocale()
  const t = useTranslations("BooksManagementPage")
  const [showError, setShowError] = useState(false)
  const [open, setOpen] = useState(false)

  const handleParseMarc21 = () => {
    try {
      const marc21Data = parsedMarc21(marc21)
      form.setValue("title", marc21Data.title)
      form.setValue("subTitle", marc21Data.subTitle)
      form.setValue("responsibility", marc21Data.responsibility)
      form.setValue("edition", marc21Data.edition)
      if (marc21Data.language) form.setValue("language", marc21Data.language)
      form.setValue("originLanguage", marc21Data.originLanguage)
      form.setValue("summary", marc21Data.summary)
      form.setValue("publicationPlace", marc21Data.publicationPlace)
      form.setValue("publisher", marc21Data.publisher)
      if (marc21Data.publicationYear)
        form.setValue("publicationYear", marc21Data.publicationYear)
      form.setValue("classificationNumber", marc21Data.classificationNumber)
      form.setValue("cutterNumber", marc21Data.cutterNumber)
      if (getIsbn) {
        form.setValue("isbn", marc21Data.isbn)
      }
      form.setValue("ean", marc21Data.ean)
      form.setValue("estimatedPrice", marc21Data.estimatedPrice)
      if (marc21Data.pageCount) form.setValue("pageCount", marc21Data.pageCount)
      form.setValue("physicalDetails", marc21Data.physicalDetails)
      if (marc21Data.dimensions)
        form.setValue("dimensions", marc21Data.dimensions)
      form.setValue("accompanyingMaterial", marc21Data.accompanyingMaterial)
      form.setValue("genres", marc21Data.genres)
      form.setValue("generalNote", marc21Data.generalNote)
      form.setValue("bibliographicalNote", marc21Data.bibliographicalNote)
      form.setValue("topicalTerms", marc21Data.topicalTerms)
      form.setValue("additionalAuthors", marc21Data.additionalAuthors)
      form.setValue("author", marc21Data.author)
      setOpen(false)
    } catch (error) {
      console.error(error)
      setShowError(true)
    } finally {
      setMarc21("")
    }
  }

  if (!show) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">{t("Copy catalog")}</Button>
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
