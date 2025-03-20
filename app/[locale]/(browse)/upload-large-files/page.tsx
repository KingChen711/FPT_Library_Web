"use client"

import { useState } from "react"

const UploadLargeFile = () => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [urls, setUrls] = useState<string[]>([])

  const chunkSize = 5 * 1024 * 1024 // 5MB mỗi phần

  const handleUpload = async () => {
    if (!file) return alert("Chọn file trước!")

    const fileSize = file.size
    let start = 0
    let chunkNumber = 1
    let uploadId = null
    const totalChunks = Math.ceil(fileSize / chunkSize)

    while (start < fileSize) {
      const chunk = file.slice(start, start + chunkSize)
      const formData = new FormData()
      formData.append("file", chunk)
      formData.append("upload_preset", "unsigned_large_files") // Thay bằng preset của bạn
      formData.append("chunk_number", chunkNumber.toString())
      formData.append("total_chunks", totalChunks.toString())
      if (uploadId) formData.append("upload_id", uploadId)

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dchmztiqg/raw/upload",
          {
            method: "POST",
            body: formData,
          }
        )

        const data = await response.json()
        if (chunkNumber === 1) uploadId = data.upload_id // Lấy upload_id từ chunk đầu tiên

        setProgress(Math.round((chunkNumber / totalChunks) * 100))

        setUrls((prev) => [...prev, data.secure_url as string]) // File đã upload thành công
      } catch (error) {
        console.error("Lỗi upload:", error)
        return
      }

      start += chunkSize
      chunkNumber++
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload</button>
      <p>Tiến trình: {progress}%</p>
      {urls && <div>{urls}</div>}
    </div>
  )
}

export default UploadLargeFile
