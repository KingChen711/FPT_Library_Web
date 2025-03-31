"use client"

import Image from "next/image"
import { BookOpen, Calendar, Globe, House } from "lucide-react"
import { useTranslations } from "next-intl"

import type { LibraryItem } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type Props = {
  libraryItem: LibraryItem
}

const BorrowItemCard = ({ libraryItem }: Props) => {
  const t = useTranslations("BookPage")

  return (
    <Card className="my-2 overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex p-4">
        <div className="relative mr-4 h-[120px] min-w-[80px] overflow-hidden rounded-md">
          <Image
            src={
              libraryItem.coverImage || "/placeholder.svg?height=120&width=80"
            }
            fill
            style={{ objectFit: "cover" }}
            alt={libraryItem.title}
            className="rounded-md"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex w-full items-start justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h3 className="line-clamp-1 flex-1 font-semibold">
                  {libraryItem.title}
                </h3>
              </div>
              <div className="flex items-center">
                <Icons.User className="mr-1 size-3" />
                <p className="text-sm text-muted-foreground">
                  {libraryItem.authors[0]?.fullName}
                </p>
              </div>
            </div>
          </div>

          <p className={cn("mt-1 line-clamp-2 text-sm text-muted-foreground")}>
            {libraryItem.summary}
          </p>

          <div className={cn("mt-2 grid grid-cols-2 gap-x-4 gap-y-1")}>
            {libraryItem.publicationYear && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 size-3" />
                <span>{libraryItem.publicationYear}</span>
              </div>
            )}

            {libraryItem.language && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Globe className="mr-1 size-3" />
                <span>{libraryItem.language}</span>
              </div>
            )}

            {libraryItem.pageCount && (
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="mr-1 size-3" />
                <span>
                  {libraryItem.pageCount} {t("pages")}
                </span>
              </div>
            )}

            {libraryItem.publicationPlace && (
              <div className="flex items-center text-xs text-muted-foreground">
                <House className="mr-1 size-3 shrink-0" />
                <span className="truncate">{libraryItem.publicationPlace}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BorrowItemCard
