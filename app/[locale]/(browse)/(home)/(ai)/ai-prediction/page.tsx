"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import AiBookUploadImg from "@/public/assets/images/ai-book-upload.png"
import { useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const AiPrediction = () => {
  const router = useRouter()
  const t = useTranslations("BookPage")
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn sự kiện click từ vùng dropzone
    setPreviewImage(null)
  }

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="relative w-full">
        <h1 className="text-center text-xl font-semibold">Welcome to</h1>
        <div className="absolute right-0 top-1/2 flex w-full -translate-y-1/2 items-center justify-end gap-2">
          <Button
            disabled={!previewImage}
            variant={"outline"}
            onClick={handleRemoveFile}
          >
            Clear
          </Button>
          <Button
            onClick={() => router.push("/ai-prediction/result")}
            disabled={!previewImage}
          >
            Let&apos;s start
          </Button>
        </div>
      </div>
      <div className="flex h-full w-2/3 flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold text-primary">
          Book AI Prediction
        </h1>
        <p className="font-semibold">
          Upload a book cover and let AI Predict the book details
        </p>

        <Card
          {...getRootProps()}
          className={`flex w-full flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed bg-card p-4 ${
            isDragActive ? "border-primary bg-primary/10" : "border-primary"
          }`}
        >
          <input {...getInputProps()} />
          {!previewImage ? (
            <div className="flex flex-col gap-2 text-center">
              <div className="flex items-center justify-center">
                <Image
                  src={AiBookUploadImg}
                  alt="Upload"
                  width={200}
                  height={200}
                  className="opacity-65"
                />
              </div>
              <h1 className="text-lg font-semibold underline">Choose Image</h1>
              <h1>or drag and drop file here</h1>

              <p className="text-sm">
                (supports document - .jpg, .jpeg, .png, .webp)
              </p>
              <p className="text-sm text-danger">No file chosen</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative flex w-full flex-col justify-center gap-4">
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="rounded-md object-contain"
                  width={400}
                  height={300}
                />
                {/* <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleRemoveFile}
                >
                  <X />
                </Button> */}
              </div>

              <p className="text-sm">
                (supports document - .jpg, .jpeg, .png, .webp)
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AiPrediction
