import { useState } from "react"
import { AudioLines, BookOpen, Clock, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { type BorrowRequestResource } from "@/lib/types/models"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import CancelSpecificResourceDialog from "../request/_components/cancel-specific-resource-dialog"

type Props = {
  resource: BorrowRequestResource
}

const BorrowResourcePreview = ({ resource }: Props) => {
  const t = useTranslations("BookPage.borrow tracking")
  const [openCancel, setOpenCancel] = useState(false)
  return (
    <>
      <CancelSpecificResourceDialog
        borrowRequestId={resource.borrowRequestId}
        resource={resource}
        open={openCancel}
        setOpen={setOpenCancel}
      />
      <Card
        key={resource.borrowRequestResourceId}
        className="overflow-hidden border transition-all hover:border-primary hover:shadow-lg"
      >
        <CardHeader className="flex items-center justify-between bg-muted/10 pb-2 pt-3">
          <div className="flex w-full items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base">
              {resource?.resourceTitle}
            </CardTitle>
            <Button variant={"destructive"} onClick={() => setOpenCancel(true)}>
              <Trash2 />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="progress"
                className="flex items-center gap-1 border-primary/20 bg-primary/5 text-xs font-normal text-primary"
              >
                {resource.libraryResource.resourceType ===
                EResourceBookType.EBOOK ? (
                  <>
                    <BookOpen className="size-3" />
                    {t("ebook")}
                  </>
                ) : (
                  <>
                    <AudioLines className="size-3" />
                    {t("audio book")}
                  </>
                )}
              </Badge>
            </div>

            {resource.defaultBorrowDurationDays && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1.5 size-3.5" />
                {t("borrow duration")}:{resource.defaultBorrowDurationDays}
                {t("days")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BorrowResourcePreview
