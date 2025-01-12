"use client"

import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const BookPredictionDialog = ({ open, setOpen }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleOnChange = (value: boolean) => {
    setOpen(value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string) // Set the preview image URL
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewImage(null) // Reset preview if no file is selected
    }
  }

  const handleButtonClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOnChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Prediction</DialogTitle>
          <DialogDescription>
            Please upload the image of the book you want to predict, then wait
            for a few seconds.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="border">
            <Label>Preview</Label>
            <div className="flex h-32 w-full items-center justify-center overflow-hidden border">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Selected preview"
                  width={80}
                  height={80}
                  className="rounded border shadow-sm"
                />
              ) : (
                <p>No image selected</p>
              )}
            </div>
          </div>
          <Button onClick={handleButtonClick}>Upload</Button>
          <Input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookPredictionDialog
