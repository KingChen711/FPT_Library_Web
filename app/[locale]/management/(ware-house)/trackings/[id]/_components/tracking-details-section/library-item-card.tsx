import React from "react"
import Image from "next/image"

import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  item: BookEdition & {
    libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  }
  onClick?: () => void
  fit?: boolean
}

function LibraryItemCard({ item, onClick, fit = false }: Props) {
  return (
    <Card
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "overflow-hidden",
        onClick && "shrink-0 cursor-pointer rounded-none",
        fit && "w-fit"
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full pb-[150%] sm:w-1/3 sm:pb-0">
            {item.coverImage ? (
              <Image
                src={item.coverImage || "/placeholder.svg"}
                alt={`Cover of ${item.title}`}
                objectFit="cover"
                height={120}
                width={80}
                className="h-[120px] w-20 object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-400">
                  No cover available
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-4 sm:w-2/3">
            <div>
              <h2 className="line-clamp-2 text-sm font-semibold">
                {item.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {item.libraryItemAuthors
                  .map((a) => a.author.fullName)
                  .join(", ")}
              </p>
            </div>
            <div className="text-xs font-bold">ISBN: {item.isbn}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LibraryItemCard
