import { http } from "@/lib/http"

import "server-only"

import { type Role } from "@/lib/types/models"

import { auth } from "../auth"

type Roles = Role[]

const getRoles = async (): Promise<Roles> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Roles>(`/api/management/roles`, {
      next: {
        tags: ["roles"],
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data || []
  } catch {
    return []
  }
}

export default getRoles
