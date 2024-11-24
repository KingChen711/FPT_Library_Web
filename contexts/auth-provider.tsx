"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { ERole } from "@/lib/types/enums"
import { type Role, type User } from "@/lib/types/models"

type UserWithRole = {
  userId: string
  role: ERole
}

type Token = {
  accessToken: string
  refreshToken: string
}

type WhoAmIResponse = (User & { role: Role }) | null

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  getAccessToken: () => string | null
  isLoadingAuth: boolean
  user: UserWithRole | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: token, isLoading: isLoadingToken } = useQuery<Token>({
    queryKey: ["token"],
    queryFn: () =>
      fetch("/api/token")
        .then((res) => res.json() ?? undefined)
        .catch(() => undefined),
  })

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "who-am-i", token],
    enabled: token !== undefined,
    // queryFn: async () =>
    //   axios
    //     .get<WhoAmIResponse>("/api/users/who-am-i", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((res) => res.data),

    queryFn: () =>
      token
        ? ({
            userId: "user id",
            role: { roleName: ERole.ADMIN },
          } as WhoAmIResponse)
        : null,
  })

  const user = useMemo(() => {
    if (!userData) return null

    return {
      ...userData,
      role: userData.role.roleName,
    }
  }, [userData])

  const getAccessToken = () => {
    return token?.accessToken ?? null
  }

  return (
    <AuthContext.Provider
      value={{
        getAccessToken,
        isLoadingAuth: isLoadingToken || isLoadingUser,
        user,
      }}
    >
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
