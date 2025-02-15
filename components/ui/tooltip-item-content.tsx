import { CheckCircle2, CircleX, Loader2, MapPin, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"

import { Badge } from "./badge"
import { Button } from "./button"

type Props = {
  id: string
}

const TooltipItemContent = ({ id }: Props) => {
  const t = useTranslations("BookPage")

  const { data: libraryItem, isLoading } = useLibraryItemDetail(id)

  if (!libraryItem) {
    return null
  }

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <div className="w-[400px]">
      <section className="flex flex-1 flex-col justify-between rounded-lg p-4">
        <div className="space-y-2 text-card-foreground">
          <p className="font-thin italic">
            {t("an edition of")} &nbsp;
            <span className="font-semibold">{libraryItem?.title}</span> (2024)
          </p>
          <h1 className="line-clamp-1 text-3xl font-semibold text-primary">
            {libraryItem?.title}
          </h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet adipisicing elit.
          </p>

          {libraryItem?.authors && libraryItem?.authors.length > 0 && (
            <p className="text-sm italic">
              by {libraryItem?.authors[0]?.fullName},
              {libraryItem.publicationYear}
            </p>
          )}
          <Badge variant={"secondary"} className="w-fit">
            Second Edition
          </Badge>
          <div className="flex justify-between text-sm">
            <div>⭐⭐⭐⭐⭐ 5/5 {t("fields.ratings")}</div>
          </div>
          <div className="flex justify-between text-sm">
            {/* Availability */}
            <div>
              <h1 className="font-semibold">{t("fields.availability")}</h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                  {t("fields.hard copy")}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                  {t("fields.ebook")}
                </div>
                <div className="flex items-center gap-2">
                  <CircleX size={16} color="white" fill="#868d87" />
                  {t("fields.audio book")}
                </div>
              </div>
            </div>
            {/* Status */}
            <div>
              <h1 className="font-semibold"> {t("fields.status")}</h1>
              <div className="mt-2 space-y-2">
                <Badge className="h-full w-fit bg-success hover:bg-success">
                  {t("fields.availability")}
                </Badge>
                <div className="flex items-center">
                  <MapPin color="white" fill="orange" /> CS A-15
                </div>
              </div>
            </div>
            <Button>
              <Plus /> {t("add to favorite")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TooltipItemContent
