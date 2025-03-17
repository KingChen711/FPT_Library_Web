import "server-only"

import { v4 as uuidv4 } from "uuid"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"

import { auth } from "../auth"

type ItemDetail = BookEdition & {
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
}

export type UntrainedGroup = {
  id: string
  groupName: string
  items: ItemDetail[]
}

export async function getUntrainedGroups(): Promise<UntrainedGroup[]> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<
      { listCheckedGroupDetail: { item: ItemDetail }[] }[]
    >(`/api/management/groups/grouped-items`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data.map((d) => ({
      id: uuidv4(),
      groupName: d.listCheckedGroupDetail?.[0]?.item?.title || "",
      items: d.listCheckedGroupDetail.map((g) => g.item),
    }))
  } catch {
    return []
  }
}
