import { cache } from "react"

import "server-only"

import axios from "axios"

import { getToken } from "./get-token"

type Role = {
  roleName: string
}

export type User = {
  userId: string
  role: Role
}

const whoAmI = cache(async (): Promise<User | null> => {
  try {
    const { data } = await axios.get<User | null>("/api/users/who-am-i", {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    })

    return data || null
  } catch {
    return null
  }
})

export default whoAmI
