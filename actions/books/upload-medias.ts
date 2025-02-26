//! This is client action

import { http } from "@/lib/http"
import { EResourceBookType } from "@/lib/types/enums"
import { getClientSideCookie } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"

export async function uploadMedias(book: TBookEditionSchema) {
  try {
    const uploadBookResourcePromises = book.libraryResources.map(async (lr) => {
      if (!lr.file || lr.resourceUrl) {
        lr.file = undefined
        return
      }

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

      lr.file = undefined
      return
    })

    const uploadBookImagePromise = async () => {
      if (
        !book.file ||
        (book.coverImage && !book.coverImage.startsWith("blob"))
      ) {
        book.file = undefined
        return
      }

      const data = await uploadBookImage(book.file)
      if (data) {
        book.coverImage = data.secureUrl
      }

      book.file = undefined
      return
    }

    // const coverFiles = (
    await Promise.all([...uploadBookResourcePromises, uploadBookImagePromise()])
    // ).filter(Boolean) as File[]
    // return coverFiles
  } catch {
    return
  }
}

export const uploadAudioBook = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("resourceType", "BookAudio")

  try {
    const { data } = await http.post<{ secureUrl: string; publicId: string }>(
      `/api/management/resources/videos/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getClientSideCookie("accessToken")}`,
        },
      }
    )
    return data
  } catch {
    return null
  }
}

export const uploadBookImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("resourceType", "BookImage")

    const { data } = await http.post<{ secureUrl: string; publicId: string }>(
      `/api/management/resources/images/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getClientSideCookie("accessToken")}`,
        },
      }
    )
    return data
  } catch {
    return null
  }
}
