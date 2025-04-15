import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import useCompleteMultipart from "./use-complete-multiparrt"
import useGenerateMultipartUrls from "./use-generate-multipart-urls"

interface FilePart {
  partNumber: number
  blob: Blob
}

function splitFileIntoParts(file: File, partSize: number): FilePart[] {
  const parts: FilePart[] = []
  let start = 0
  let partNumber = 1

  while (start < file.size) {
    const end = Math.min(start + partSize, file.size)
    const blob = file.slice(start, end)
    parts.push({ partNumber, blob })
    start = end
    partNumber++
  }

  return parts
}

function useUploadMultipart() {
  const { mutateAsync: generateMultipartUrls } = useGenerateMultipartUrls()
  const { mutateAsync: completeMultipart } = useCompleteMultipart()

  return useMutation({
    mutationFn: async (file: File): Promise<string | null> => {
      const PART_SIZE = 5 * 1024 * 1024 // 5MB
      const parts: FilePart[] = splitFileIntoParts(file, PART_SIZE)

      try {
        // Step 1: Init upload session
        const initRes = await generateMultipartUrls(parts.length)

        if (!initRes) throw Error("")

        const { uploadId, s3PathKey, urls } = initRes

        // Step 3: Upload các phần song song
        const uploadPromises = parts.map((part, index) =>
          axios
            .put(urls[index], part.blob, {
              headers: {
                "Content-Type": file.type,
              },
            })
            .then((response) => {
              const etag = response.headers.etag?.replaceAll('"', "")
              return { partNumber: part.partNumber, eTag: etag as string }
            })
        )

        // Sử dụng Promise.all để đợi tất cả các phần được upload
        const uploadedParts = await Promise.all(uploadPromises)

        // Step 4: Complete upload
        await completeMultipart({
          uploadId,
          s3PathKey,
          uploadedParts,
        })

        return s3PathKey
      } catch (err) {
        console.log(err)
        return null
      }
    },
  })
}

export default useUploadMultipart
