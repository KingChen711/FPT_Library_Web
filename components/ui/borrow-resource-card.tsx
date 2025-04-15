import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { type BookResource, type LibraryItem } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import BorrowDigitalConfirm from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/borrow-digital-confirm"

type ResourceCardProps = {
  libraryItem: LibraryItem
  resource: BookResource
  type: EResourceBookType
}

const BorrowResourceCard = ({
  resource,
  type,
  libraryItem,
}: ResourceCardProps) => {
  const { isManager } = useAuth()
  const router = useRouter()
  const t = useTranslations("BookPage")
  const [openDigitalBorrow, setOpenDigitalBorrow] = useState<boolean>(false)
  const [isBorrowed, setIsBorrowed] = useState<boolean>(false)
  const { digitalBorrows } = libraryItem

  useEffect(() => {
    if (digitalBorrows && digitalBorrows.length > 0) {
      digitalBorrows.forEach((digitalBorrow) => {
        if (
          digitalBorrow.resourceId === resource.resourceId &&
          digitalBorrow.status === 0
        ) {
          setIsBorrowed(true)
          return
        }
      })
    }
  }, [digitalBorrows, openDigitalBorrow, resource.resourceId])

  return (
    <>
      <BorrowDigitalConfirm
        selectedResource={resource}
        open={openDigitalBorrow}
        setOpen={setOpenDigitalBorrow}
      />
      <Card className="overflow-hidden border-muted">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-lg font-medium">
                {resource.resourceTitle} _ {isBorrowed && "Borrowed"}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={"draft"} className="text-xs">
                  {type === EResourceBookType.EBOOK
                    ? t("ebook")
                    : t("audio book")}
                </Badge>
              </div>
            </div>
            {resource.borrowPrice && resource.borrowPrice > 0 && (
              <Badge variant="default" className="font-semibold">
                {formatPrice(resource.borrowPrice)}
              </Badge>
            )}
          </div>

          {resource.defaultBorrowDurationDays && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("borrow duration")}: {resource.defaultBorrowDurationDays}{" "}
              {t("days")}
            </p>
          )}
        </CardContent>

        {isBorrowed ? (
          <CardFooter className="flex justify-between gap-2 p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                router.push(
                  `/books/resources/${resource.resourceId}?resourceType=${type}&libraryItemId=${libraryItem.libraryItemId}&isPreview=false`
                )
              }
            >
              <Eye className="mr-2 size-4" />
              {t("view")}
            </Button>
            {/* TODO: add extend */}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isManager}
            >
              {t("extend")}
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex justify-between gap-2 p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                router.push(
                  `/books/resources/${resource.resourceId}?resourceType=${type}&libraryItemId=${libraryItem.libraryItemId}&isPreview=true`
                )
              }
            >
              <Eye className="mr-2 size-4" />
              {t("preview")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isManager}
              onClick={() => setOpenDigitalBorrow(true)}
            >
              {t("borrow")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
export default BorrowResourceCard
