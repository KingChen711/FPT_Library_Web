"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { ERoleType } from "@/lib/types/enums"
import { type CurrentUser } from "@/lib/types/models"
import { getClientSideCookie } from "@/lib/utils"

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
  isManager: boolean
  refetchToken: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient()
  const [isManager, setIsManager] = useState<boolean>(false)

  // const { data: token, isFetching: isLoadingToken } = useQuery<
  //   Token | undefined
  // >({
  //   queryKey: ["token"],
  //   queryFn: async () => {
  //     try {
  //       const res: Token = await fetch("/api/token").then((res) => res.json())
  //       return res || undefined
  //     } catch {
  //       return undefined
  //     }
  //   },
  // })

  const [token, setToken] = useState<Token | undefined>(() => {
    const accessToken = getClientSideCookie("accessToken")
    const refreshToken = getClientSideCookie("refreshToken")
    if (!accessToken || !refreshToken) return undefined
    return { accessToken, refreshToken }
  })

  const refetchToken = () => {
    const accessToken = getClientSideCookie("accessToken")
    const refreshToken = getClientSideCookie("refreshToken")
    if (!accessToken || !refreshToken) {
      setToken(undefined)
      return
    }
    setToken({ accessToken, refreshToken })
  }

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
    if (
      userData.role.roleType === ERoleType.EMPLOYEE ||
      (userData.role.roleType === ERoleType.USER &&
        userData.role.englishName === "Administration")
    ) {
      setIsManager(true)
    }
    return userData
  }, [userData])

  const accessToken = useMemo(() => token?.accessToken ?? null, [token])

  //refresh token
  useEffect(() => {
    const timer = setInterval(
      () => {
        // queryClient.invalidateQueries({
        //   queryKey: ["token"],
        // })
        refetchToken()
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
        isLoadingAuth: isLoadingUser,
        user,
        isManager,
        refetchToken,
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
