import { cache } from "react"

import "server-only"

import { http } from "@/lib/http"
import { type Role, type User } from "@/lib/types/models"

import { auth } from "./auth"

type WhoAmIResponse = User & { role: Role }

const whoAmI = cache(async (): Promise<WhoAmIResponse | null> => {
  const { getToken } = auth()

  try {
    const data = await http.get<WhoAmIResponse>("/api/users/who-am-i", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      next: {
        revalidate: 60,
        tags: ["who-am-i"],
      },
    })

    return data || null
  } catch {
    return null
  }
})

export default whoAmI
