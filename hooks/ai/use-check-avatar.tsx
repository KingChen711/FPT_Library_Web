import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type EGender } from "@/lib/types/enums"

export type TCheckAvatarRes = {
  faces: {
    attributes: {
      gender: {
        value: EGender
      }
      age: {
        value: number
      }
    }
  }[]
}

function useCheckAvatar() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (formData: FormData): Promise<TCheckAvatarRes> => {
      try {
        const { data } = await http.post<TCheckAvatarRes>(
          `/api/face-detection/detect`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
        return { faces: [] }
      }
    },
  })
}

export default useCheckAvatar
