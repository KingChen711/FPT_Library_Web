//!client action

import axios from "axios"

import { getClientSideCookie } from "@/lib/utils"

export const NOT_CLOUDINARY_URL = "78965107564389573570673235098086710"

export const updateBookImage = async (prevUrl: string, file: File) => {
  try {
    const publicId = prevUrl.match(
      /upload\/(?:v\d+\/)?([^\/]+)\.(?:jpg|jpeg|png|pdf)$/
    )?.[1]

    console.log({ publicId, prevUrl })

    if (!publicId) return NOT_CLOUDINARY_URL

    const formData = new FormData()
    formData.append("file", file)
    formData.append("publicId", publicId)

    const { data } = await axios.put<{
      data: { secureUrl: string; publicId: string }
    }>(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/resources/images/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getClientSideCookie("accessToken")}`,
        },
      }
    )
    return data.data
  } catch {
    return null
  }
}
