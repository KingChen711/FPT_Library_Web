import "server-only"

import { http } from "@/lib/http"
import { type LibraryPackage } from "@/lib/types/models"

import { auth } from "../auth"

export async function getPackages(): Promise<LibraryPackage[]> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<LibraryPackage[]>(
      `/api/management/packages`,
      {
        next: {
          tags: ["packages"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data
  } catch {
    return []
  }
}
