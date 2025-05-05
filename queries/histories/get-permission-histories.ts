/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type EAccessLevel } from "@/lib/types/enums"
import { type Audit, type Role } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

import { auth } from "../auth"

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

export type PermissionHistories = (Audit & {
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

const getPermissionHistories = async (
  searchParams: TSearchAuditsSchema
): Promise<Pagination<PermissionHistories>> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<Pagination<PermissionHistories>>(
      `/api/management/roles/audits`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
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
              ? getPermission(Number(audit.oldValues.PermissionId))
              : null,
            Number(audit.newValues.PermissionId)
              ? getPermission(Number(audit.newValues.PermissionId))
              : null,
            Number(audit.entityId)
              ? getRolePermission(Number(audit.entityId))
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
}

export default getPermissionHistories

const getRolePermission = async (
  id: number
): Promise<RolePermission | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<RolePermission>(
      `/api/management/roles/user-permissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

const getPermission = async (id: number): Promise<Permission | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Permission>(
      `/api/management/roles/permissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}
