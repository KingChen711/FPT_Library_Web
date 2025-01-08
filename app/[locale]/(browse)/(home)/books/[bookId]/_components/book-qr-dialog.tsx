import { useState } from "react"
import { ChevronLeft, Cloud, Phone, QrCode } from "lucide-react"

import BookPreview from "@/components/ui/book-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  onFileSelect: (file: File | null) => void
}

export function BookQrDialog({ open, setOpen, onFileSelect }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <QrCode
          size={24}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-primary"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Scan barcode</DialogTitle>
        </DialogHeader>
        <section className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary p-4">
          <div className="text-center font-semibold">
            <h1>Drag and drop and image or</h1>
            <h1 className="text-primary">browse to upload</h1>
          </div>

          <Button asChild className="mx-auto cursor-pointer">
            <Label htmlFor="file">Upload image</Label>
          </Button>
          <Input
            id="file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-sm">
            File must be JPEG, JPG, or PNG and up to 10MB
          </p>
        </section>
        {selectedFile && <BookPreview objectUrl={selectedFile} />}

        <div className="flex flex-col items-center gap-4">
          <Button className="w-1/2">
            <Phone /> Scan from mobile app
          </Button>
          <Button className="w-1/2">
            <Cloud /> Select from your cloud
          </Button>
          <Button
            variant={"outline"}
            className="w-1/2"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft /> Back to enter barcode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
