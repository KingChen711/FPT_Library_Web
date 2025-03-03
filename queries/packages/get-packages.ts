import "server-only"

import { http } from "@/lib/http"
import { type Package } from "@/lib/types/models"

import { auth } from "../auth"

export async function getPackages(): Promise<Package[]> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Package[]>(`/api/management/packages`, {
      next: { tags: ["packages"] },
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
    return data
  } catch {
    return []
  }
}
