"use client"

import { Book, BookOpen, Headphones } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import type { BookResource, LibraryItem } from "@/lib/types/models"
import BorrowResourceCard from "@/components/ui/borrow-resource-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type Props = {
  libraryItem: LibraryItem
  open: boolean
  setOpen: (value: boolean) => void
  resources: BookResource[]
}

const BookDigitalListDialog = ({
  open,
  setOpen,
  resources,
  libraryItem,
}: Props) => {
  console.log("🚀 ~ libraryItem:", libraryItem)
  const t = useTranslations("BookPage")

  const ebookResources =
    resources.filter(
      (resource) => resource.resourceType === EResourceBookType.EBOOK
    ) || []

  const audioBookResources =
    resources.filter(
      (resource) => resource.resourceType === EResourceBookType.AUDIO_BOOK
    ) || []

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("digital list")}
            </DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              {t("digital list desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-6">
            {ebookResources.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Book className="size-5 text-primary" />
                  <h2 className="text-xl font-semibold">{t("ebook list")}</h2>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {ebookResources.map((resource) => (
                    <BorrowResourceCard
                      libraryItem={libraryItem}
                      key={resource.resourceId}
                      resource={resource}
                      type={EResourceBookType.EBOOK}
                    />
                  ))}
                </div>
              </div>
            )}

            {audioBookResources.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Headphones className="size-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {t("audio book list")}
                  </h2>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {audioBookResources.map((resource) => (
                    <BorrowResourceCard
                      libraryItem={libraryItem}
                      key={resource.resourceId}
                      resource={resource}
                      type={EResourceBookType.AUDIO_BOOK}
                    />
                  ))}
                </div>
              </div>
            )}

            {resources.length === 0 && (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto size-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  {t("resource not found")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BookDigitalListDialog
