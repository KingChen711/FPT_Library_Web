import { useMutation } from "@tanstack/react-query"

import { EResourceBookType } from "@/lib/types/enums"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"

import useUploadImage from "./use-upload-image"
import useUploadVideo from "./use-upload-video"

function useUploadCatalogMedias() {
  const { mutateAsync: uploadBookImage } = useUploadImage()
  const { mutateAsync: uploadAudioBook } = useUploadVideo()

  return useMutation({
    mutationFn: async (book: TBookEditionSchema) => {
      try {
        const uploadBookResourcePromises = book.libraryResources.map(
          async (lr) => {
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
          }
        )

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
        await Promise.all([
          ...uploadBookResourcePromises,
          uploadBookImagePromise(),
        ])
        // ).filter(Boolean) as File[]
        // return coverFiles
      } catch {
        return
      }
    },
  })
}

export default useUploadCatalogMedias
