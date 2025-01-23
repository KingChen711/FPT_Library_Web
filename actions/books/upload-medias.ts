//! This is client action

import axios from "axios"

import { EResourceBookType } from "@/lib/types/enums"
import { getClientSideCookie } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/mutate-book"

export async function uploadMedias(book: TBookEditionSchema) {
  try {
    const uploadBookResourcePromises = book.libraryResources.map(async (lr) => {
      if (!lr.file || lr.resourceUrl) return

      if (lr.resourceType === EResourceBookType.AUDIO_BOOK) {
        const data = await uploadAudioBook(lr.file)
        if (data) {
          lr.resourceUrl = data.secureUrl
          lr.providerPublicId = data.publicId
          lr.resourceSize = Math.round(lr.file.size)
        }
      } else {
        const data = await uploadBookImage(lr.file)
        if (data) {
          lr.resourceUrl = data.secureUrl
          lr.providerPublicId = data.publicId
          lr.resourceSize = Math.round(lr.file.size)
        }
      }

      return
    })

    // const uploadBookImagesPromises = book.bookEditions.map(async (be) => {
    //   if (!be.file) return null

    //   const data = await uploadBookImage(be.file)
    //   if (data) {
    //     be.coverImage = data.secureUrl
    //   }

    //   const file = be.file
    //   be.file = undefined
    //   return file
    // })

    // const coverFiles = (
    await Promise.all([
      ...uploadBookResourcePromises,
      // ...uploadBookImagesPromises,
    ])
    // ).filter(Boolean) as File[]
    // return coverFiles
  } catch (error) {
    console.log(error)
    // return []
  }
}

export const uploadAudioBook = async (file: File) => {
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

export const uploadBookImage = async (file: File) => {
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
