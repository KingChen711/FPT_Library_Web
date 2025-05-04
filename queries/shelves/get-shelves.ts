/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Floor,
  type Section,
  type Shelf,
  type Zone,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchShelvesSchema } from "@/lib/validations/shelves/get-shelves"

import { auth } from "../auth"

export type Shelves = {
  floor: Floor
  zone: Zone
  section: Section
  libraryShelf: Shelf
}[]

const getShelves = async (
  searchParams: TSearchShelvesSchema
): Promise<Pagination<Shelves>> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<Pagination<Shelves>>(
      `/api/management/location/shelves`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams,
      }
    )

    return (
      data || {
        pageIndex: 0,
        pageSize: 0,
        sources: [],
        totalActualItem: 0,
        totalPage: 0,
      }
    )
  } catch {
    return {
      pageIndex: 0,
      pageSize: 0,
      sources: [],
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getShelves
