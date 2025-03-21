"use client"

import {
  useState,
  type ForwardRefExoticComponent,
  type JSX,
  type RefAttributes,
} from "react"
import Image from "next/image"
import { LocalStorageKeys } from "@/constants"
import {
  Book,
  BookMarked,
  BookOpen,
  BookX,
  Box,
  Calendar,
  Clock,
  Globe,
  Languages,
  MapPin,
  Plus,
  TagIcon as PriceTag,
  Printer,
  ScrollText,
  User2,
  Users,
  type LucideProps,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { cn, formatPrice, localStorageHandler } from "@/lib/utils"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import BookDigitalListDialog from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-digital-list-dialog"
import BookInstancesTab from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-tabs/book-instances-tab"

import { Badge } from "./badge"
import { Button } from "./button"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"

type Props = {
  id: string
  shownInventory?: boolean
  showResources?: boolean
  showInstances?: boolean
  showImage?: boolean
}

const LibraryItemInfo = ({
  id,
  showResources = true,
  showInstances = true,
  showImage = false,
}: Props): JSX.Element | null => {
  const t = useTranslations("BookPage")
  const { data: libraryItem, isLoading } = useLibraryItemDetail(id)
  const [openDigitalList, setOpenDigitalList] = useState<boolean>(false)

  if (isLoading) {
    return <LibraryItemInfoLoading />
  }

  if (!libraryItem) return null

  localStorageHandler.addRecentItem(
    LocalStorageKeys.OPENING_RECENT,
    libraryItem.libraryItemId.toString()
  )

  return (
    <div className="space-y-4 text-foreground">
      <BookDigitalListDialog
        libraryItemId={id}
        resources={libraryItem.resources}
        open={openDigitalList}
        setOpen={setOpenDigitalList}
      />

      <div className="flex items-start gap-4">
        {showImage && (
          <Image
            src={libraryItem.coverImage || ""}
            alt=""
            width={120}
            height={160}
          />
        )}
        <section className="flex-1 space-y-2">
          <p className="font-thin italic">
            {t("an edition of")} &nbsp;
            <span className="font-semibold">{libraryItem.title}</span>
          </p>
          <h1 className="line-clamp-2 text-2xl font-semibold text-primary">
            {libraryItem.title}
          </h1>
          <p className="text-muted-foreground">{libraryItem.subTitle}</p>
          {libraryItem.authors.length > 0 && (
            <div className="flex items-center gap-2 text-sm italic">
              <User2 size={16} />
              {libraryItem.authors[0].fullName as string}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="draft" className="w-fit">
              No.{libraryItem.editionNumber} Edition
            </Badge>
            <Badge variant="draft" className="w-fit">
              {libraryItem.category.englishName}
            </Badge>
          </div>
          <div className="my-2 text-sm">
            ⭐ {libraryItem.avgReviewedRate} / 5 {t("fields.ratings")}
          </div>

          {libraryItem.summary && (
            <p className="text-sm">{libraryItem.summary}</p>
          )}
        </section>
      </div>

      <section className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <div className="space-y-4">
          <InfoItem
            icon={Globe}
            label={t("fields.language")}
            value={libraryItem.language}
          />
          <InfoItem
            icon={Languages}
            label={t("fields.originLanguage")}
            value={libraryItem.originLanguage}
          />
          <InfoItem
            icon={Calendar}
            label={t("fields.publicationYear")}
            value={libraryItem.publicationYear?.toString()}
          />

          <InfoItem
            icon={MapPin}
            label={t("fields.publicationPlace")}
            value={libraryItem.publicationPlace}
          />
        </div>
        <div className="space-y-2">
          {libraryItem.estimatedPrice && (
            <InfoItem
              icon={PriceTag}
              label={t("fields.estimatedPrice")}
              value={formatPrice(libraryItem.estimatedPrice)}
            />
          )}
          <InfoItem
            icon={ScrollText}
            label={t("fields.pageCount")}
            value={libraryItem.pageCount?.toString()}
          />
          <InfoItem
            icon={Printer}
            label={t("fields.publisher")}
            value={libraryItem.publisher}
          />
          <InfoItem
            icon={MapPin}
            label={t("fields.shelf")}
            value={libraryItem.shelf?.shelfNumber}
          />
        </div>
      </section>
      <InfoItem
        className="text-sm"
        icon={Users}
        label={t("fields.responsibility")}
        value={libraryItem.responsibility}
      />
      <InfoItem
        icon={BookOpen}
        label={t("fields.genres")}
        value={libraryItem.genres}
      />
      <Separator />

      {
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            {t("fields.inventory")}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <InventoryItem
              icon={Box}
              label={t("fields.totalUnits")}
              value={libraryItem.libraryItemInventory.totalUnits}
              color="blue"
            />
            <InventoryItem
              icon={BookMarked}
              label={t("fields.availableUnits")}
              value={libraryItem.libraryItemInventory.availableUnits}
              color="green"
            />
            <InventoryItem
              icon={Clock}
              label={t("fields.requestUnits")}
              value={libraryItem.libraryItemInventory.requestUnits}
              color="orange"
            />
            <InventoryItem
              icon={BookX}
              label={t("fields.borrowedUnits")}
              value={libraryItem.libraryItemInventory.borrowedUnits}
              color="red"
            />
            <InventoryItem
              icon={Clock}
              label={t("fields.reservedUnits")}
              value={libraryItem.libraryItemInventory.reservedUnits}
              color="purple"
            />
          </div>
        </section>
      }
      <section className="flex flex-col items-start justify-start gap-4">
        <Button
          onClick={() =>
            localStorageHandler.setItem(LocalStorageKeys.FAVORITE, id)
          }
        >
          <Plus className="mr-1 size-4" /> {t("add to favorite")}
        </Button>
        {showResources && (
          <section className="flex items-center gap-4">
            <Button
              onClick={() =>
                localStorageHandler.setItem(LocalStorageKeys.BORROW, id)
              }
            >
              <Book /> <span>{t("borrow")}</span>
            </Button>

            {libraryItem.resources && libraryItem.resources.length > 0 && (
              <Button
                asChild
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpenDigitalList(true)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="mr-1 size-4" />
                  {t("digital list")}
                </div>
              </Button>
            )}
          </section>
        )}
      </section>
      {showInstances && <BookInstancesTab libraryItem={libraryItem} />}
    </div>
  )
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  label: string
  value: string | null | undefined
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Icon className="size-4 text-muted-foreground" />
    <span className="font-medium">{label}:</span> {value || "N/A"}
  </div>
)

const InventoryItem = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  label: string
  value: number
  color: string
}) => (
  <div className="flex items-center justify-between gap-2 rounded-md border p-2 shadow-sm">
    <div className="flex items-center gap-2">
      <Icon className="size-4" color={color} />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span>{value}</span>
  </div>
)

const LibraryItemInfoLoading = () => (
  <div className="space-y-4 text-foreground">
    <div className="flex items-start gap-4">
      <div className="h-[160px] w-full rounded-md bg-muted" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-[80px]" />
          <Skeleton className="h-5 w-[100px]" />
        </div>
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>

    <Separator />

    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>

    <div className="space-y-2">
      <Skeleton className="h-10 w-[200px]" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[160px]" />
      </div>
    </div>
  </div>
)

export default LibraryItemInfo
