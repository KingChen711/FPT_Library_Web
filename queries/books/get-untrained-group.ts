import "server-only"

import { v4 as uuidv4 } from "uuid"

import { http } from "@/lib/http"
import { type EGroupCheckType } from "@/lib/types/enums"
import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
} from "@/lib/types/models"
import { type TGroupCheckRes } from "@/actions/books/group-checks"

import { auth } from "../auth"

type ItemDetail = BookEdition & {
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  category: Category
}

export type UntrainedGroup = {
  id: string
  groupName: string
  items: ItemDetail[]
  groupCheckResult: TGroupCheckRes
}

export async function getUntrainedGroups(): Promise<UntrainedGroup[]> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<
      {
        listCheckedGroupDetail: {
          item: BookEdition & {
            libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
            category: Category
          }
          isRoot: boolean
          propertiesChecked: {
            CutterNumber: EGroupCheckType
            ClassificationNumber: EGroupCheckType
            Author: EGroupCheckType
            Title: EGroupCheckType
            SubTitle: EGroupCheckType
          }
        }[]
        isAbleToCreateGroup: EGroupCheckType
      }[]
    >(`/api/management/groups/grouped-items`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data.map((groupCheckResult) => ({
      id: uuidv4(),
      groupName:
        groupCheckResult.listCheckedGroupDetail?.[0]?.item?.title || "",
      items: groupCheckResult.listCheckedGroupDetail.map((g) => g.item),
      groupCheckResult,
    }))
  } catch {
    return []
  }
}
