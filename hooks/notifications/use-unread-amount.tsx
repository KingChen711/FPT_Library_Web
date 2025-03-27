import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { ERoleType } from "@/lib/types/enums"

function useUnreadAmount() {
  const { accessToken, user } = useAuth()

  return useQuery({
    queryKey: ["unread-notifications-amount", accessToken, user],
    queryFn: async () => {
      try {
        if (!accessToken || !user || user.role.roleType === ERoleType.EMPLOYEE)
          return 0
        console.log(accessToken, user)

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
