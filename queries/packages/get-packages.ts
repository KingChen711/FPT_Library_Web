import "server-only"

import { http } from "@/lib/http"
import { type Package } from "@/lib/types/models"

export async function getPackages(): Promise<Package[]> {
  try {
    const { data } = await http.get<Package[]>(`/api/packages`, {
      next: {
        tags: ["packages"],
      },
    })
    return data
  } catch {
    return []
  }
}
