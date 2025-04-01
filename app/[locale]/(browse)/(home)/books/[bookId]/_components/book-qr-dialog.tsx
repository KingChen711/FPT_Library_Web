"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { ChevronLeft, Cloud, Phone, QrCode, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"

import BookPreview from "@/components/ui/book-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  onFileSelect: (file: File | null) => void
}

export function BookQrDialog({ open, setOpen, onFileSelect }: Props) {
  console.log("🚀 ~ BookQrDialog ~ onFileSelect:", onFileSelect)
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
      <DialogTrigger asChild>
        <QrCode
          size={24}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-primary"
        />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("scan barcode")}</DialogTitle>
        </DialogHeader>
        <section
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-4 ${
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
        {selectedFile && <BookPreview objectUrl={selectedFile} />}

        <div className="flex flex-col items-center gap-4">
          <Button className="w-1/2">
            <Phone /> {tGeneralManagement("scan from mobile app")}
          </Button>
          <Button className="w-1/2">
            <Cloud /> {tGeneralManagement("select from your cloud")}
          </Button>
          <Button
            variant={"outline"}
            className="w-1/2"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft /> {tGeneralManagement("back to enter barcode")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
