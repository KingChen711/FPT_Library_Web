/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type BookEdition, type Shelf } from "@/lib/types/models"

import { auth } from "../auth"

export type ShelfDetail = Shelf & {
  unitSummary: {
    totalUnits: number
    totalAvailableUnits: number
    totalRequestUnits: number
    totalBorrowedUnits: number
    totalReservedUnits: number
    totalOverdueUnits: number
    totalCanBorrow: number
    totalDamagedUnits: number
    totalLostUnits: number
    totalDigitalResources: number
  }
  libraryItems: BookEdition[]
}

const getShelf = async (shelfId: number): Promise<ShelfDetail | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<ShelfDetail>(
      `/api/management/location/shelves/${shelfId}/detail`,
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

export default getShelf
