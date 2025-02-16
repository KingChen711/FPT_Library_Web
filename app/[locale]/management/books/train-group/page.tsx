import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBook, { type BookDetail } from "@/queries/books/get-book"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { http } from "@/lib/http"

import TrainGroupForm from "./train-group-form"

type Props = {
  searchParams: Record<string, string>
}

async function TrainGroupPage({ searchParams }: Props) {
  const ids: number[] = Array.from(
    new Set(
      z
        .array(z.coerce.number().or(z.null()).catch(null))
        .parse(
          searchParams.itemIds
            ? Array.isArray(searchParams.itemIds)
              ? searchParams.itemIds
              : [searchParams.itemIds]
            : []
        )
        .filter((n) => n !== null)
    )
  )

  if (ids.length < 1) {
    notFound()
  }

  const [rootItemId, ...otherItemIds] = ids
  const { getAccessToken } = auth()

  let bookCode: string | undefined
  try {
    const { data: dataDefine } = await http.post<{ trainingCode: string }>(
      "/api/management/groups/define-group",
      { rootItemId, otherItemIds },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    bookCode = dataDefine.trainingCode || undefined
  } catch {}

  if (!bookCode) {
    notFound()
  }

  const books = await Promise.all(ids.map((id) => getBook(id)))

  if (
    books.some((b) => !b || !b.title || !b.coverImage || !b.isbn || b.isTrained)
  ) {
    notFound()
  }

  const t = await getTranslations("BooksManagementPage")

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold">{t("Train books group")}</h3>
      </div>
      <TrainGroupForm bookCode={bookCode} books={books as BookDetail[]} />
    </div>
  )
}

export default TrainGroupPage
