//!client action

import { NOT_CLOUDINARY_URL } from "@/constants"

import { http } from "@/lib/http"
import { getClientSideCookie } from "@/lib/utils"

export const updateBookVideo = async (prevUrl: string, file: File) => {
  try {
    const publicId = prevUrl.match(/upload\/(?:v\d+\/)?([^\/]+)\.(?:mp3)$/)?.[1]

    if (!publicId) return NOT_CLOUDINARY_URL

    const formData = new FormData()
    formData.append("file", file)
    formData.append("publicId", publicId)

    const { data } = await http.put<{
      secureUrl: string
      publicId: string
    }>(`/api/management/resources/videos/update`, formData, {
      headers: {
        Authorization: `Bearer ${getClientSideCookie("accessToken")}`,
      },
    })
    return data
  } catch {
    return null
  }
}
