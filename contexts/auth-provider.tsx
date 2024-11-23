"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useLocalStorage } from "@reactuses/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { type ERole } from "@/lib/types/enums"
import { type Role, type User } from "@/lib/types/models"

type UserWithRole = {
  userId: string
  role: ERole
}

type WhoAmIResponse = (User & { role: Role }) | null

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  getToken: () => string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  isLoadingAuth: boolean
  user: UserWithRole | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useLocalStorage<string | null>("accessToken", null)

  const { data: userData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ["auth", "who-am-i", token],
    queryFn: async () =>
      axios
        .get<WhoAmIResponse>("/api/users/who-am-i", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
  })

  const user = useMemo(() => {
    if (!userData) return null

    return {
      ...userData,
      role: userData.role.roleName,
    }
  }, [userData])

  const getToken = () => {
    return token
  }

  return (
    <AuthContext.Provider value={{ getToken, setToken, isLoadingAuth, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}
