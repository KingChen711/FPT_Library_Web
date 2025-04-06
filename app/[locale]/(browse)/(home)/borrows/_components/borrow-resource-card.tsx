"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import useResourceDetail from "@/hooks/library-items/use-resource-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"

import { type SelectedBorrow } from "../page"
import DeleteBorrowRequestConfirm from "./delete-borrow-request-confirm"

type Props = {
  resourceId: number
  selectedBorrow: SelectedBorrow
  setSelectedBorrow: Dispatch<SetStateAction<SelectedBorrow>>
}

const BorrowResourceCard = ({
  resourceId,
  selectedBorrow,
  setSelectedBorrow,
}: Props) => {
  const t = useTranslations("BookPage")
  const { data, isLoading } = useResourceDetail(resourceId)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="flex h-[300px] items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return <NoData />
  }

  const handleToggleSelect = () => {
    const resourceIds = [...selectedBorrow.selectedResourceIds]
    if (resourceIds.includes(resourceId)) {
      console.log(123)
      resourceIds.splice(resourceIds.indexOf(resourceId), 1)
    } else {
      resourceIds.push(resourceId)
    }
    setSelectedBorrow((prev: SelectedBorrow) => ({
      ...prev,
      selectedResourceIds: Array.from(resourceIds),
    }))
  }

  return (
    <>
      <DeleteBorrowRequestConfirm
        libraryItemTitle={data.resourceTitle}
        open={openDelete}
        setOpen={setOpenDelete}
        id={resourceId}
        type="resource"
        setSelectedBorrow={setSelectedBorrow}
      />
      <Card className="w-full overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          {/* Content */}
          <div className="flex flex-1 flex-col">
            <CardHeader className="pb-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h1 className="flex-1 cursor-pointer text-xl font-bold leading-tight">
                  {data.resourceTitle}
                </h1>
                <div className="flex items-center gap-4">
                  <Button
                    variant={"ghost"}
                    onClick={() => handleToggleSelect()}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      color="white"
                      checked={selectedBorrow.selectedResourceIds.includes(
                        resourceId
                      )}
                    />
                    <Label className="cursor-pointer">
                      {t("select borrow")}
                    </Label>
                  </Button>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => setOpenDelete(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2
                      color="red"
                      size={20}
                      className="cursor-pointer text-muted-foreground"
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={"draft"} className="text-xs">
                      {data.resourceType === EResourceBookType.EBOOK
                        ? t("ebook")
                        : t("audio book")}
                    </Badge>
                  </div>
                </div>
              </div>

              {data.defaultBorrowDurationDays && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("borrow duration")}: {data.defaultBorrowDurationDays}{" "}
                  {t("days")}
                </p>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </>
  )
}

export default BorrowResourceCard
