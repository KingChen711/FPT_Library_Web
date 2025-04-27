import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { useLibraryStorage } from "@/contexts/library-provider"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType, type EBorrowDigitalStatus } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import BorrowDigitalStatusBadge from "./borrow-digital-status-badge"
import { Icons } from "./icons"

type ResourceCardProps = {
  libraryItemId: number
  isBorrowed: boolean
  resource: BookResource
  type: EResourceBookType
  status: EBorrowDigitalStatus | null | undefined
  canExtend: boolean
}

const BorrowResourceCard = ({
  libraryItemId,
  resource,
  type,
  status,
  canExtend,
  isBorrowed,
}: ResourceCardProps) => {
  const { isManager } = useAuth()
  const router = useRouter()
  const t = useTranslations("BookPage")

  const { borrowedResources } = useLibraryStorage()

  const isAdded = borrowedResources.has(resource.resourceId)

  const handleBorrowDigital = () => {
    borrowedResources.toggle(resource.resourceId)
    toast({
      title: isAdded ? t("deleted to borrow list") : t("added to borrow list"),
      variant: "info",
    })
  }

  return (
    <>
      {/* <BorrowDigitalConfirm
        selectedResource={resource}
        open={openDigitalBorrow}
        setOpen={setOpenDigitalBorrow}
      /> */}
      <Card className="overflow-hidden border-muted">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-lg font-medium">
                {resource.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={"draft"} className="text-xs">
                  {type === EResourceBookType.EBOOK
                    ? t("ebook")
                    : t("audio book")}
                </Badge>
                {status && <BorrowDigitalStatusBadge status={status} />}
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

        <CardFooter className="flex justify-between gap-2 p-4 pt-0">
          {isBorrowed ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                router.push(
                  `/books/resources/${resource.resourceId}?resourceType=${type}&libraryItemId=${libraryItemId}&isPreview=false`
                )
              }
            >
              <Eye className="mr-2 size-4" />
              {t("view")}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                router.push(
                  `/books/resources/${resource.resourceId}?resourceType=${type}&libraryItemId=${libraryItemId}&isPreview=true`
                )
              }
            >
              <Eye className="size-4" />
              {t("preview")}
            </Button>
          )}
          {canExtend ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isManager}
            >
              <Icons.Upgrade className="size-4" />
              {t("extend")}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isManager}
              onClick={handleBorrowDigital}
            >
              <Icons.BorrowRequest className="size-4" />
              {isAdded ? t("remove borrow") : t("borrow")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}
export default BorrowResourceCard
