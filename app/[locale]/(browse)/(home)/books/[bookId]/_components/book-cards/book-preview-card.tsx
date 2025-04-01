import Image from "next/image"
import NoImage from "@/public/assets/images/no-image.png"
import { MapPin, NotebookPen, Share } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { type LibraryItem } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import LocateButton from "@/components/ui/locate-button"

type Props = {
  libraryItem: LibraryItem
}

const BookPreviewCard = async ({ libraryItem }: Props) => {
  const t = await getTranslations("BookPage")

  return (
    <div className="flex h-[60vh] flex-col justify-between overflow-hidden rounded-md border bg-card shadow-lg">
      <div className="flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-t-lg p-4">
        <Image
          src={libraryItem?.coverImage || NoImage}
          alt="Logo"
          width={200}
          height={250}
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="flex flex-col border-t-2">
        {libraryItem?.shelf && (
          <LocateButton
            shelfId={libraryItem.shelf.shelfId}
            shelfNumber={libraryItem.shelf.shelfNumber}
          >
            <Button className="flex items-center rounded-none">
              <MapPin /> {t("locate")}
            </Button>
          </LocateButton>
        )}

        <div className="flex items-center justify-between py-2">
          <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
            <NotebookPen size={16} /> {t("review")}
          </div>
          <div className="h-6 w-0.5 bg-primary" />
          <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
            <Share size={16} /> {t("share")}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookPreviewCard
