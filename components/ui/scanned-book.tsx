"use client"

import React, { useState } from "react"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { Download, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchIsbnRes } from "@/hooks/books/use-search-isbn"

import { Button } from "./button"
import Copitor from "./copitor"
import ImageWithFallback from "./image-with-fallback"

type Props = {
  book: TSearchIsbnRes
}

function ScannedBook({ book }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [downLoading, setDownLoading] = useState(false)

  const handleDownloadImage = async () => {
    if (!book.coverImage || downLoading) return

    setDownLoading(true)

    const response = await fetch(book.coverImage, { mode: "cors" })
    if (!response.ok) {
      throw new Error("Failed to fetch image")
    }

    const blob = await response.blob()

    // Create an object URL from the blob
    const objectUrl = URL.createObjectURL(blob)

    // Create an anchor element and trigger download
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = `${book.title || "book"}-cover.jpg`

    // Append to body, click, and clean up
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Revoke the object URL
    URL.revokeObjectURL(objectUrl)

    setDownLoading(false)
  }

  return (
    <div className="max-w-2xl overflow-hidden rounded-lg border shadow-lg">
      <div className="md:flex">
        <div className="group relative md:shrink-0">
          {book.coverImage ? (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 z-10 hidden group-hover:inline-flex"
                onClick={handleDownloadImage}
              >
                {downLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download className="text-primary" />
                )}
              </Button>
              <ImageWithFallback
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                width={192}
                height={288}
                className="z-0 h-72 w-48 object-cover"
                fallbackSrc={defaultBookCover}
              />
            </>
          ) : (
            <div className="flex h-72 items-center justify-center md:w-48">
              <span className="text-muted-foreground">
                {t("No cover available")}
              </span>
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            {book.publicationYear ? (
              <Copitor
                className="shrink-0"
                content={book.publicationYear.toString()}
              />
            ) : null}
            {book.publicationYear
              ? `Published in ${book.publicationYear}`
              : "Publication year unknown"}
          </div>

          <div className="mt-1 flex gap-1">
            {book.title && (
              <Copitor className="shrink-0" content={book.title} />
            )}
            <h1 className="text-2xl font-bold leading-tight">
              {book.title || t("Untitled")}
            </h1>
          </div>

          <div className="mt-2 flex gap-1">
            {book.authors && (
              <Copitor className="shrink-0" content={book.authors} />
            )}
            {book.authors && (
              <p className="text-muted-foreground">
                {t("by")} {book.authors}
              </p>
            )}
          </div>

          <div className="flex gap-1">
            {book.summary && (
              <Copitor className="shrink-0" content={book.summary} />
            )}
            {book.summary && (
              <p className="text-muted-foreground">{book.summary}</p>
            )}
          </div>

          <div className="mb-2 mt-4 flex flex-wrap">
            <div className="flex gap-1">
              {book.publishers && (
                <Copitor className="shrink-0" content={book.publishers} />
              )}
              {book.publishers && (
                <span className="mr-4 text-sm text-muted-foreground">
                  <strong>{t("Publishers")}:</strong> {book.publishers}
                </span>
              )}
            </div>

            <div className="mb-2 flex gap-1">
              {book.pageCount && (
                <Copitor
                  className="shrink-0"
                  content={book.pageCount.toString()}
                />
              )}
              {book.pageCount && (
                <span className="mr-4 text-sm text-muted-foreground">
                  <strong>{t("Pages")}:</strong> {book.pageCount}
                </span>
              )}
            </div>

            <div className="mb-2 flex gap-1">
              {book.isbn && (
                <Copitor className="shrink-0" content={book.isbn} />
              )}
              {book.isbn && (
                <span className="text-sm text-muted-foreground">
                  <strong>ISBN:</strong> {book.isbn}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScannedBook
