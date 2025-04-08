"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import useResourceDetail from "@/hooks/library-items/use-resource-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Props = {
  resourceId: number
  allowToBorrowResources?: number[]
  setAllowToBorrowResources?: (ids: number[]) => void
}

const AvailableBorrowResource = ({
  resourceId,
  allowToBorrowResources,
  setAllowToBorrowResources,
}: Props) => {
  const t = useTranslations("BookPage")

  const { data: resource, isLoading } = useResourceDetail(resourceId)

  if (isLoading) {
    return <Loader2 className="size-6 animate-spin" />
  }

  if (!resource) {
    return null
  }

  const handleCheck = (libraryItemId: number) => {
    if (!setAllowToBorrowResources || !allowToBorrowResources) return
    if (allowToBorrowResources.includes(libraryItemId)) {
      setAllowToBorrowResources(
        allowToBorrowResources.filter((id) => id !== libraryItemId)
      )
    } else {
      setAllowToBorrowResources([...allowToBorrowResources, libraryItemId])
    }
  }

  return (
    <Card className="my-2 overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <section className="flex w-full items-start justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="line-clamp-1 flex-1 font-semibold">
                {resource?.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={"draft"} className="text-xs">
                  {resource.resourceType === EResourceBookType.EBOOK
                    ? t("ebook")
                    : t("audio book")}
                </Badge>
              </div>
            </div>
            {setAllowToBorrowResources && (
              <Button
                variant={"ghost"}
                onClick={() => handleCheck(resourceId)}
                className="flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  color="white"
                  checked={allowToBorrowResources!.includes(resourceId)}
                />
                <Label className="cursor-pointer">{t("select borrow")}</Label>
              </Button>
            )}
          </section>
        </div>

        {resource.defaultBorrowDurationDays && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("borrow duration")}: {resource.defaultBorrowDurationDays}{" "}
            {t("days")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default AvailableBorrowResource
