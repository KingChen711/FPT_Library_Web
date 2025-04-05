import { http } from "@/lib/http"

import "server-only"

import { type LibraryCard, type Patron } from "@/lib/types/models"

import { auth } from "../auth"

export type PatronDetail = Patron & { libraryCard: LibraryCard | null }

const getPatron = async (userId: string): Promise<PatronDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<PatronDetail>(
      `/api/management/library-card-holders/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data || null
  } catch {
    return null
  }
}

export default getPatron
