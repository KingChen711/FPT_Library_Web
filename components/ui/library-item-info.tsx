"use client"

import {
  type ForwardRefExoticComponent,
  type JSX,
  type RefAttributes,
} from "react"
import { Link } from "@/i18n/routing"
import {
  BookMarked,
  BookOpen,
  BookX,
  Box,
  Calendar,
  Clock,
  Globe,
  Headphones,
  Languages,
  Loader2,
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

import { cn } from "@/lib/utils"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import BookBorrowDialog from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-borrow-dialog"
import BookInstancesTab from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-tabs/book-instances-tab"

import { Badge } from "./badge"
import { Button } from "./button"
import { Separator } from "./separator"

type Props = {
  id: string
  shownInventory?: boolean
  showResources?: boolean
  showInstances?: boolean
}

const LibraryItemInfo = ({
  id,
  showResources = true,
  showInstances = true,
}: Props): JSX.Element | null => {
  const t = useTranslations("BookPage")
  const { data: libraryItem, isLoading } = useLibraryItemDetail(id)

  if (isLoading) return <Loader2 className="animate-spin" />
  if (!libraryItem) return null

  return (
    <div className="space-y-4 text-foreground">
      <section className="space-y-2">
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
            <User2 size={16} /> by &nbsp;
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

      <InfoItem
        className="text-sm"
        icon={Users}
        label={t("fields.responsibility")}
        value={libraryItem.responsibility}
      />
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
            icon={Printer}
            label={t("fields.publisher")}
            value={libraryItem.publisher}
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
              value={`${libraryItem.estimatedPrice.toLocaleString()} VND`}
            />
          )}
          <InfoItem
            icon={ScrollText}
            label={t("fields.pageCount")}
            value={libraryItem.pageCount?.toString()}
          />
          <InfoItem
            icon={BookOpen}
            label={t("fields.genres")}
            value={libraryItem.genres}
          />
          <InfoItem
            icon={MapPin}
            label={t("fields.shelf")}
            value={libraryItem.shelf?.shelfNumber}
          />
        </div>
      </section>
      <Separator />

      {
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            {t("fields.inventory")}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
        <Button>
          <Plus className="mr-1 size-4" /> {t("add to favorite")}
        </Button>
        {showResources && (
          <section className="flex items-center gap-4">
            <BookBorrowDialog />
            {[
              { label: "audio", icon: Headphones, query: "audio=true" },
              { label: "read now", icon: BookOpen, query: "audio=false" },
            ].map(({ label, icon: Icon, query }) => (
              <Button key={label} asChild variant="outline">
                <Link
                  href={`/books/${libraryItem.libraryItemId}/ebook?${query}`}
                >
                  <Icon className="mr-1 size-4" /> {t(label)}
                </Link>
              </Button>
            ))}
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
  <div className="flex items-center gap-2 rounded-md border p-2 shadow-sm">
    <Icon className="size-4" color={color} />
    <span className="text-xs font-medium">
      {label} {value}
    </span>
  </div>
)

export default LibraryItemInfo
