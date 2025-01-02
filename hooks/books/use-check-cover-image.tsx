import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export type TCheckCoverImageRes = {
  fieldPoints: {
    name: string
    detail: string
    matchedPoint: number
    isPassed: boolean
  }[]
  totalPoint: number
  confidenceThreshold: number
}

function useCheckCoverImage() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post<{
        data: TCheckCoverImageRes
      }>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/book/ai/check-book-edition`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      return data.data
    },
  })
}

export default useCheckCoverImage
