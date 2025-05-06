"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type EAccessLevel } from "@/lib/types/enums"
import { type Audit, type Role } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

type Feature = {
  featureId: number
  vietnameseName: string
  englishName: string
}

type Permission = {
  permissionId: number
  permissionLevel: EAccessLevel
  vietnameseName: string
  englishName: string
}

type RolePermission = {
  role: Role
  feature: Feature
}

type PermissionHistories = (Audit & {
  role?: Role
  feature?: Feature
  newValues: {
    PermissionId?: string
    Permission?: Permission
  }
  oldValues: {
    PermissionId?: string
    Permission?: Permission
  }
})[]

function usePermissionHistories(searchParams: TSearchAuditsSchema) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["audits", searchParams, accessToken],
    queryFn: async (): Promise<Pagination<PermissionHistories>> => {
      if (!accessToken)
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<Pagination<PermissionHistories>>(
          `/api/management/roles/audits`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              entityName: "RolePermission",
            },
          }
        )

        const audits = await Promise.all(
          data.sources.map(async (audit) => {
            const [oldPermission, newPermission, rolePermission] =
              await Promise.all([
                Number(audit.oldValues.PermissionId)
                  ? getPermission(
                      Number(audit.oldValues.PermissionId),
                      accessToken
                    )
                  : null,
                Number(audit.newValues.PermissionId)
                  ? getPermission(
                      Number(audit.newValues.PermissionId),
                      accessToken
                    )
                  : null,
                Number(audit.entityId)
                  ? getRolePermission(Number(audit.entityId), accessToken)
                  : null,
              ])

            audit.oldValues.Permission = oldPermission || undefined
            audit.newValues.Permission = newPermission || undefined
            audit.role = rolePermission?.role || undefined
            audit.feature = rolePermission?.feature || undefined
            return audit
          })
        )

        if (!data || !data?.sources?.length)
          return {
            sources: [],
            pageIndex: 0,
            pageSize: 0,
            totalActualItem: 0,
            totalPage: 0,
          }

        return { ...data, sources: audits }
      } catch {
        return {
          sources: [],
          pageIndex: 0,
          pageSize: 0,
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default usePermissionHistories

const getRolePermission = async (
  id: number,
  accessToken: string
): Promise<RolePermission | null> => {
  try {
    const { data } = await http.get<RolePermission>(
      `/api/management/roles/user-permissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

const getPermission = async (
  id: number,
  accessToken: string
): Promise<Permission | null> => {
  try {
    const { data } = await http.get<Permission>(
      `/api/management/roles/permissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}
