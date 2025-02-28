"use client"

import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type CurrentUser } from "@/lib/types/models"

type Token = {
  accessToken: string
  refreshToken: string
}

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  accessToken: string | null
  isLoadingAuth: boolean
  user: CurrentUser | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient()

  const { data: token, isFetching: isLoadingToken } = useQuery<
    Token | undefined
  >({
    queryKey: ["token"],
    queryFn: async () => {
      try {
        const res: Token = await fetch("/api/token").then((res) => res.json())
        return res || undefined
      } catch {
        return undefined
      }
    },
  })

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "who-am-i", token],
    enabled: token !== undefined,
    queryFn: async () =>
      http
        .get<CurrentUser>("/api/auth/current-user", {
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
          },
        })
        .then((res) => res.data),
  })

  const user = useMemo(() => {
    if (!userData) return null

    return userData
  }, [userData])

  const accessToken = useMemo(() => token?.accessToken ?? null, [token])

  //refresh token
  useEffect(() => {
    const timer = setInterval(
      () => {
        queryClient.invalidateQueries({
          queryKey: ["token"],
        })
      },
      1000 * 60 * 20
    )

    return () => {
      clearInterval(timer)
    }
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        accessToken,
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
