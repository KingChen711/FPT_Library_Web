import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type User } from "@/lib/types/models"

function useRecipients(notificationId: number, enabled: boolean) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ["unread-notifications-amount", accessToken],
    queryFn: async (): Promise<string[]> => {
      try {
        if (!accessToken) return []

        const { data } = await http.get<{
          notificationRecipients: { recipient: User }[]
        }>(`/api/management/notifications/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        return data.notificationRecipients.map((n) => n.recipient.email)
      } catch {
        return []
      }
    },
    placeholderData: keepPreviousData,
    enabled,
  })
}

export default useRecipients
