"use server"

import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type EGroupCheckType } from "@/lib/types/enums"
import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"

export type TGroupCheckRes = {
  listCheckedGroupDetail: {
    item: BookEdition & {
      libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
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
}

export async function groupChecks(
  ids: number[]
): Promise<ActionResponse<TGroupCheckRes>> {
  const { getAccessToken } = auth()
  try {
    const [rootItemId, ...otherItemIds] = ids

    const { data } = await http.post<TGroupCheckRes>(
      "/api/management/groups/check",
      { rootItemId, otherItemIds },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
