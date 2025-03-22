import { http } from "@/lib/http"

import "server-only"

import { auth } from "@/queries/auth"

import { type LibraryCard } from "@/lib/types/models"

// type LibraryCardDetail = (LibraryCard&previou)

const getCard = async (libraryCardId: string): Promise<LibraryCard | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<LibraryCard>(
      `/api/management/library-cards/${libraryCardId}`,
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

export default getCard
