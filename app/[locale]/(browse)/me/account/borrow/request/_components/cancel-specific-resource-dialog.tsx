import { useTransition } from "react"
import { AudioLines, BookOpen, Clock } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EResourceBookType } from "@/lib/types/enums"
import { type BorrowRequestResource } from "@/lib/types/models"
import { cancelRequestResourcePatron } from "@/actions/borrows/cancel-request-resource-patron"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  borrowRequestId: number
  resource: BorrowRequestResource
  className?: string
}

const CancelSpecificResourceDialog = ({
  borrowRequestId,
  open,
  setOpen,
  className,
  resource,
}: Props) => {
  const locale = useLocale()
  const t = useTranslations("BookPage.borrow tracking")
  const [isPending, startTransition] = useTransition()

  const onSubmit = async () => {
    startTransition(async () => {
      const res = await cancelRequestResourcePatron(
        borrowRequestId,
        resource.resourceId
      )
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`sm:max-w-2xl ${className}`}>
        <DialogHeader>
          <DialogTitle>Cancel this item in this borrow request</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please check your borrow request
            details below.
          </DialogDescription>
        </DialogHeader>
        <Card
          key={resource.borrowRequestResourceId}
          className="overflow-hidden border transition-all hover:border-primary hover:shadow-lg"
        >
          <CardHeader className="bg-muted/10 pb-2 pt-3">
            <CardTitle className="line-clamp-1 text-base">
              {resource?.resourceTitle}
            </CardTitle>
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
                  {t("borrow duration")}: {resource.defaultBorrowDurationDays}
                  {t("days")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <DialogClose>
              <Button variant={"outline"} disabled={isPending}>
                Close
              </Button>
            </DialogClose>
            <Button onClick={() => onSubmit()} disabled={isPending}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CancelSpecificResourceDialog
