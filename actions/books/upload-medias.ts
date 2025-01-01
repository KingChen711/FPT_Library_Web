//! This is client action

import axios from "axios"

import { EResourceBookType } from "@/lib/types/enums"
import { getClientSideCookie } from "@/lib/utils"
import { type TMutateBookSchema } from "@/lib/validations/books/mutate-book"

export async function uploadMedias(book: TMutateBookSchema) {
  try {
    const uploadBookResourcePromises = book.bookResources.map(async (br) => {
      if (!br.file) return null

      if (br.resourceType === EResourceBookType.AUDIO_BOOK) {
        const data = await uploadAudioBook(br.file)
        if (data) {
          br.resourceUrl = data.secureUrl
          br.providerPublicId = data.publicId
          br.resourceSize = Math.round(br.file.size)
        }
      } else {
        const data = await uploadBookImage(br.file)
        if (data) {
          br.resourceUrl = data.secureUrl
          br.providerPublicId = data.publicId
          br.resourceSize = Math.round(br.file.size)
        }
      }

      br.file = undefined
    })

    const uploadBookImagesPromises = book.bookEditions.map(async (be) => {
      if (!be.file) return null

      const data = await uploadBookImage(be.file)
      if (data) {
        be.coverImage = data.secureUrl
      }

      be.file = undefined
    })

    await Promise.all([
      ...uploadBookResourcePromises,
      ...uploadBookImagesPromises,
    ])
  } catch (error) {
    console.log(error)
  }
}

const uploadAudioBook = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("resourceType", "BookAudio")

  try {
    const { data } = await axios.post<{
      data: { secureUrl: string; publicId: string }
    }>(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/resources/videos/upload`,
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

const uploadBookImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("resourceType", "BookImage")

    const { data } = await axios.post<{
      data: { secureUrl: string; publicId: string }
    }>(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/resources/images/upload`,
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
