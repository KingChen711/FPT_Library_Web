import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useUnreadAmount() {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ["unread-notifications-amount", accessToken],
    queryFn: async () => {
      try {
        if (!accessToken) return 0

        const { data } = await http
          .get<number>(`/api/privacy/unread-noti`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .catch(() => ({ data: 0 }))

        return data
      } catch {
        return 0
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useUnreadAmount
