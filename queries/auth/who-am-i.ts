import { cache } from "react"

import "server-only"

import axios from "axios"

import { type Role, type User } from "@/lib/types/models"

import { getToken } from "./get-token"

type WhoAmIResponse = User & { role: Role }

const whoAmI = cache(async (): Promise<WhoAmIResponse | null> => {
  try {
    const { data } = await axios.get<WhoAmIResponse>("/api/users/who-am-i", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    return data || null
  } catch {
    return null
  }
})

export default whoAmI
