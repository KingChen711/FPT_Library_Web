"use client"

import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type EAuditType } from "@/lib/types/enums"
import { type Audit } from "@/lib/types/models"

type Props = {
  dateUtc: string
  trailType: EAuditType
  entityName: string
  enabled: boolean
}

function useAudit(props: Props) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["audit", props, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Audit | Audit[]>(
          `/api/management/library-items/audits/detail`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: props,
          }
        )
        return (Array.isArray(data) ? data : [data]) || null
      } catch {
        return null
      }
    },
    enabled: props.enabled,
  })
}

export default useAudit
