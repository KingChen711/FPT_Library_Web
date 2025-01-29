"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const BookPredictionDialog = ({ open, setOpen }: Props) => {
  const t = useTranslations("BookPage")
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)

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
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn sự kiện click từ vùng dropzone
    setSelectedFile(null)
    setPreviewImage(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Prediction</DialogTitle>
          <DialogDescription>
            Please upload the image of the book you want to predict, then wait
            for a few seconds.
          </DialogDescription>
        </DialogHeader>

        <section
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-4 ${
            isDragActive ? "border-primary bg-primary/10" : "border-primary"
          }`}
        >
          <input {...getInputProps()} />
          {!previewImage ? (
            <div className="text-center font-semibold">
              <h1>{tGeneralManagement("drag and drop and image or")}</h1>
              <h1 className="text-primary">
                {tGeneralManagement("browse to upload")}
              </h1>
            </div>
          ) : (
            <div className="relative flex w-full max-w-sm justify-center">
              <Image
                src={previewImage}
                alt="Preview"
                className="rounded-md object-cover"
                width={200}
                height={200}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleRemoveFile} // Sử dụng sự kiện với stopPropagation
              >
                <X />
              </Button>
            </div>
          )}

          <p className="text-sm">
            File must be JPEG, JPG, or PNG and up to 10MB.
          </p>
        </section>

        <Button className="mt-4 w-full" disabled={!selectedFile}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default BookPredictionDialog
