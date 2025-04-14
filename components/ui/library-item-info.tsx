"use client"

import {
  useEffect,
  useState,
  type ForwardRefExoticComponent,
  type JSX,
  type RefAttributes,
} from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { useFavourite } from "@/contexts/favourite-provider"
import { useLibraryStorage } from "@/contexts/library-provider"
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
  TagIcon as PriceTag,
  Printer,
  ScrollText,
  User2,
  Users,
  type LucideProps,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Rating } from "react-simple-star-rating"

import { cn, formatPrice, splitCamelCase } from "@/lib/utils"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import BookDigitalListDialog from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-digital-list-dialog"
import BookInstancesTab from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/book-tabs/book-instances-tab"
import BorrowLibraryItemConfirm from "@/app/[locale]/(browse)/(home)/books/[bookId]/_components/borrow-library-item-confirm"

import { Badge } from "./badge"
import { Button } from "./button"
import { Icons } from "./icons"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"

type Props = {
  id: number
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
  const locale = useLocale()
  const { isManager, user } = useAuth()
  const { data: libraryItem, isLoading } = useLibraryItemDetail(id)
  const [openDigitalList, setOpenDigitalList] = useState<boolean>(false)
  const [openAddBorrowConfirm, setOpenAddBorrowConfirm] = useState(false)
  const { favouriteItemIds, toggleFavorite, isLoadingFavourite } =
    useFavourite()
  const isFavourite = libraryItem
    ? favouriteItemIds.includes(libraryItem?.libraryItemId)
    : false

  const { recentlyOpened } = useLibraryStorage()

  useEffect(() => {
    if (libraryItem) {
      if (recentlyOpened.items.includes(libraryItem.libraryItemId)) {
        recentlyOpened.remove(libraryItem.libraryItemId)
        recentlyOpened.add(libraryItem.libraryItemId)
        return
      }
      recentlyOpened.add(libraryItem.libraryItemId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryItem])

  if (isLoading) {
    return <LibraryItemInfoLoading />
  }

  if (!libraryItem) return null

  return (
    <div className="space-y-4 text-foreground">
      <BookDigitalListDialog
        libraryItem={libraryItem}
        resources={libraryItem.resources}
        open={openDigitalList}
        setOpen={setOpenDigitalList}
      />

      <BorrowLibraryItemConfirm
        libraryItem={libraryItem}
        open={openAddBorrowConfirm}
        setOpen={setOpenAddBorrowConfirm}
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
              {t("edition")} {libraryItem.editionNumber}
            </Badge>
            <Badge variant="draft" className="w-fit">
              {locale === "vi"
                ? splitCamelCase(libraryItem.category.vietnameseName)
                : splitCamelCase(libraryItem.category.englishName)}
            </Badge>
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <span>{t("ratings")}</span>
              <Rating
                rtl={locale === "ar"}
                size={20}
                iconsCount={5}
                allowFraction
                readonly
                initialValue={libraryItem?.avgReviewedRate || 0}
                disableFillHover
                className="mb-1 flex"
              />
            </div>
            <p className="text-xs font-semibold">
              {libraryItem.pageCount} {t("pages")}
            </p>
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

          {libraryItem.shelf && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoItem
                    icon={MapPin}
                    label={t("fields.shelf")}
                    value={libraryItem.shelf?.shelfNumber}
                    className="cursor-pointer font-semibold"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {locale === "vi"
                      ? libraryItem.shelf?.vieShelfName
                      : libraryItem.shelf?.engShelfName}
                  </p>
                  <p>
                    {libraryItem.shelf.classificationNumberRangeFrom} -{" "}
                    {libraryItem.shelf.classificationNumberRangeTo}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </section>
      <InfoItem
        className="text-sm"
        icon={Users}
        label={t("fields.responsibility")}
        value={libraryItem.responsibility}
      />
      <InfoItem
        className="text-sm"
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
      <section className="flex items-start justify-start gap-4">
        {!isManager && user && !isLoadingFavourite && (
          <Button
            onClick={() => toggleFavorite(libraryItem.libraryItemId)}
            variant="outline"
          >
            {isFavourite ? (
              <Icons.FillHeart className="mr-1 size-4 text-danger" />
            ) : (
              <Icons.Heart className="mr-1 size-4" />
            )}{" "}
            {t("add to favorite")}
          </Button>
        )}
        {showResources && (
          <section className="flex items-center gap-4">
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

            {!isManager && (
              <Button onClick={() => setOpenAddBorrowConfirm(true)}>
                <Book />
                <span>{t("add borrow list")}</span>
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
