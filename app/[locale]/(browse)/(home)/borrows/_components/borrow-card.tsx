"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { useBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import {
  Book,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Trash2,
  User,
} from "lucide-react"
import { useTranslations } from "next-intl"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import { Separator } from "@/components/ui/separator"

import DeleteBorrowRequestConfirm from "./delete-borrow-request-confirm"

type Props = {
  libraryItemId: string
}

const BorrowCard = ({ libraryItemId }: Props) => {
  const t = useTranslations("BookPage")
  const router = useRouter()
  const { selectedLibraryItemIds: selectedIds, toggleLibraryItemId: toggleId } =
    useBorrowRequestStore()
  const { data, isLoading } = useLibraryItemDetail(libraryItemId)
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

  const isAvailable = data.libraryItemInventory?.availableUnits > 0

  return (
    <>
      <DeleteBorrowRequestConfirm
        libraryItemTitle={data.title}
        open={openDelete}
        setOpen={setOpenDelete}
        libraryItemId={libraryItemId}
      />
      <Card className="w-full overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="relative flex w-full items-center justify-center overflow-hidden md:h-auto md:w-[200px]">
            {data.coverImage ? (
              <Image
                src={data.coverImage || "/placeholder.svg"}
                alt={data.title}
                className="rounded-lg object-cover"
                height={240}
                width={160}
              />
            ) : (
              <Book className="size-16 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h1
                  onClick={() => router.push(`/books/${libraryItemId}`)}
                  className="flex-1 cursor-pointer text-xl font-bold leading-tight"
                >
                  {data.title}
                </h1>
                <div className="flex items-center gap-4">
                  <Button
                    variant={"ghost"}
                    onClick={() => toggleId(libraryItemId)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      color="white"
                      checked={selectedIds.includes(libraryItemId)}
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
              {data.authors && data.authors.length > 0 && (
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="size-3.5" />
                  <span>
                    {data.authors.map((author) => author.fullName).join(", ")}
                  </span>
                </div>
              )}
              <Badge
                variant={isAvailable ? "success" : "destructive"}
                className="w-fit font-normal"
              >
                {isAvailable
                  ? t("fields.availability")
                  : t("fields.unavailability")}
              </Badge>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-2">
              {/* Summary */}
              {data.summary && (
                <div className="line-clamp-2 text-sm text-muted-foreground">
                  {data.summary}
                </div>
              )}

              <Separator />

              {/* Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-3">
                {data.publisher && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.publisher")}
                    </p>
                    <p>{data.publisher}</p>
                  </div>
                )}
                {data.publicationYear && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.year")}
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <p>{data.publicationYear}</p>
                    </div>
                  </div>
                )}
                {data.publicationPlace && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.year")}
                    </p>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <p>{data.publicationPlace}</p>
                    </div>
                  </div>
                )}
                {data.pageCount && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.pageCount")}
                    </p>
                    <div className="flex items-center gap-1">
                      <BookOpen className="size-3.5 text-muted-foreground" />
                      <p>{data.pageCount}</p>
                    </div>
                  </div>
                )}
                {data.isbn && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.isbn")}
                    </p>
                    <p className="font-mono text-xs">{data.isbn}</p>
                  </div>
                )}
                {data.language && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("fields.language")}
                    </p>
                    <p className="capitalize">{data.language}</p>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-2 pt-2">
              {data.category?.totalBorrowDays && (
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Clock className="size-4" />
                  <span>
                    {t("borrow duration")}: {data.category.totalBorrowDays}{" "}
                    {t("days")}
                  </span>
                </div>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </>
  )
}

export default BorrowCard
