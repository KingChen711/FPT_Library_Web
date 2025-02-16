"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { EGroupCheckType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import { type TGroupCheckRes } from "@/actions/books/group-checks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"

const getStatusInfo = (status: EGroupCheckType) => {
  switch (status) {
    case EGroupCheckType.GroupSuccess:
      return {
        icon: <CheckCircle className="size-5" />,
        color: "text-success",
      }
    case EGroupCheckType.GroupFailed:
      return { icon: <XCircle className="size-5" />, color: "text-danger" }
    case EGroupCheckType.AbleToForceGrouped:
      return {
        icon: <AlertCircle className="size-5" />,
        color: "text-warning",
      }
  }
}

const PropertyCheck: React.FC<{
  property: string
  status: EGroupCheckType
}> = ({ property, status }) => {
  const t = useTranslations("BooksManagementPage")
  const { icon, color } = getStatusInfo(status)
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      {icon}
      <span>{t(property)}</span>
    </div>
  )
}

// Component to display item details
const ItemDetail: React.FC<TGroupCheckRes["listCheckedGroupDetail"][0]> = ({
  item,
  isRoot,
  propertiesChecked,
}) => {
  const t = useTranslations("BooksManagementPage")

  return (
    <div
      className={cn(
        `rounded-md border bg-card p-4`,
        isRoot && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-4 flex gap-4">
        {item.coverImage ? (
          <Image
            width={64}
            height={96}
            src={item.coverImage}
            alt={item.title}
            objectFit="cover"
            className="h-[132] w-[88px] rounded-md border object-cover"
          />
        ) : (
          <div className="h-[132] w-[88px] rounded-md border object-cover"></div>
        )}
        <div className="flex flex-col">
          <p className="line-clamp-1 text-xs text-muted-foreground">
            ISBN:{item.isbn}
          </p>
          <h3 className="line-clamp-1 text-lg font-bold">{item.title}</h3>

          <p className="mb-2 line-clamp-1 text-sm">
            <span className="font-semibold">{t("Authors")}:</span>{" "}
            {item.libraryItemAuthors.map((a) => a.author.fullName).join(", ")}
          </p>

          {item.subTitle && (
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {item.subTitle}
            </p>
          )}
          <p className="mb-2 line-clamp-1 text-sm">
            <span className="font-semibold">{t("Cutter number")}:</span>{" "}
            {item.cutterNumber}
          </p>
          <p className="mb-4 line-clamp-1 text-sm">
            <span className="font-semibold">{t("Classification number")}:</span>{" "}
            {item.classificationNumber}
          </p>
        </div>
      </div>
      {!isRoot && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(propertiesChecked).map(([key, value]) => (
            <PropertyCheck key={key} property={key} status={value} />
          ))}
        </div>
      )}
    </div>
  )
}

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  results: TGroupCheckRes | null | undefined
}

function GroupCheckResultDialog({ open, setOpen, results }: Props) {
  const t = useTranslations("BooksManagementPage")
  const router = useRouter()

  if (!results) {
    return null
  }

  const { icon: groupStatusIcon, color: groupStatusColor } = getStatusInfo(
    results.isAbleToCreateGroup
  )

  const handleTrain = () => {
    const newUrl =
      "/management/books/train-group?" +
      results.listCheckedGroupDetail
        .map((d) => `itemIds=${d.item.libraryItemId}`)
        .join("&")

    router.push(newUrl)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogDescription>
            <div className="mx-auto max-w-4xl">
              <h1 className="text-xl font-bold">{t("Group check results")}</h1>
              <div
                className={`flex items-center gap-2 ${groupStatusColor} mb-4 text-lg`}
              >
                {groupStatusIcon}
                <span>
                  {t("Group can be created")}:{" "}
                  {results.isAbleToCreateGroup === EGroupCheckType.GroupSuccess
                    ? t("Yes")
                    : results.isAbleToCreateGroup ===
                        EGroupCheckType.AbleToForceGrouped
                      ? t("Force grouping possible")
                      : t("No")}
                </span>
              </div>
              <div className="grid gap-6">
                {results.listCheckedGroupDetail.map((detail, index) => (
                  <ItemDetail key={index} {...detail} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
              <DialogClose>
                <Button variant="outline">{t("Cancel")}</Button>
              </DialogClose>
              <Button
                disabled={
                  results.isAbleToCreateGroup === EGroupCheckType.GroupFailed
                }
                onClick={handleTrain}
              >
                Train AI
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default GroupCheckResultDialog
