"use client"

import { useState } from "react"
import { Loader2, Pencil } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import useShelves from "@/hooks/shelf/use-shelves"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import { ShelfCard } from "@/components/ui/shelf-card"
import ShelfBadge from "@/components/badges/shelf-badge"

type Props = {
  initShelfName: string | undefined
  onChange: (val: number | undefined) => void
  libraryItemId: number
  open?: boolean
  setOpen?: (val: boolean) => void
}

export default function ShelfSelector({
  onChange,
  initShelfName,
  open,
  setOpen,
  libraryItemId,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [editMode, setEditMode] = useState(false)
  const [shelfName, setShelfName] = useState(initShelfName)
  const [isMostAppropriate, setIsMostAppropriate] = useState(true)
  const [isChildrenSection, setIsChildrenSection] = useState(false)
  const [isJournalSection, setIsJournalSection] = useState(false)
  const [isReferenceSection, setIsReferenceSection] = useState(false)

  const [selectedShelf, setSelectedShelf] = useState<number | undefined>(
    undefined
  )

  const { data: shelveData, isLoading: loadingShelves } = useShelves({
    libraryItemId,
    isMostAppropriate,
    isChildrenSection,
    isJournalSection,
    isReferenceSection,
  })

  if (!editMode && (open === undefined || !open)) {
    return (
      <div className="flex items-center gap-2">
        {shelfName ? <ShelfBadge shelfNumber={shelfName} /> : <NoData />}
        <Pencil
          className="size-4 cursor-pointer hover:text-primary"
          onClick={() => {
            setEditMode(true)
            if (setOpen) {
              setOpen(true)
            }
          }}
        />
      </div>
    )
  }

  if (loadingShelves) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border p-4 pt-5">
        <Loader2 className="size-9 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-md border p-4">
      {/* <div className="flex flex-wrap gap-6 gap-y-3"> */}
      <div className="flex items-center gap-y-2">
        <Label>{t("Classification number")}</Label>
        <p>: {shelveData?.itemClassificationNumber}</p>
      </div>

      <div className="flex items-center gap-y-2">
        <Label>{t("Floor")}</Label>
        <p>: {shelveData?.floor.floorNumber}</p>
      </div>

      <div className="flex items-center gap-y-2">
        <Label>{t("Zone")}</Label>
        <p>
          :{" "}
          {locale === "vi"
            ? shelveData?.zone.vieZoneName
            : shelveData?.zone.engZoneName}
        </p>
      </div>

      <div className="flex items-center gap-y-2">
        <Label>{t("Section")}</Label>
        <p>
          :{" "}
          {locale === "vi"
            ? shelveData?.section.vieSectionName
            : shelveData?.section.engSectionName}
        </p>
      </div>
      {/* </div> */}

      <div className="flex flex-col gap-y-2">
        <Label>{t("Shelf")}</Label>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isMostAppropriate}
              onCheckedChange={(val) => setIsMostAppropriate(Boolean(val))}
              id="most-appropriate"
            />
            <Label
              htmlFor="most-appropriate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("Most appropriate shelves")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isChildrenSection}
              onCheckedChange={(val) => setIsChildrenSection(Boolean(val))}
              id="most-appropriate"
            />
            <Label
              htmlFor="most-appropriate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("Children section")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isJournalSection}
              onCheckedChange={(val) => setIsJournalSection(Boolean(val))}
              id="most-appropriate"
            />
            <Label
              htmlFor="most-appropriate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("Journal section")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isReferenceSection}
              onCheckedChange={(val) => setIsReferenceSection(Boolean(val))}
              id="most-appropriate"
            />
            <Label
              htmlFor="most-appropriate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("Reference section")}
            </Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {shelveData?.libraryShelves?.map((s) => (
            <ShelfCard
              key={s.shelfId}
              shelf={s}
              onClick={() => setSelectedShelf(s.shelfId)}
              selected={selectedShelf === s.shelfId}
            />
          ))}
          {shelveData?.libraryShelves.length === 0 && (
            <div className="flex h-[278px] w-full items-center justify-center">
              {t("Appropriate shelves not found")}
            </div>
          )}
        </div>

        {/* <Select onValueChange={(value) => setSelectedShelf(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={t("Select shelf")} />
          </SelectTrigger>
          <SelectContent>
            {shelveData?.libraryShelves?.length === 0 && (
              <SelectItem value="no-data" disabled className="text-center">
                <NoData />
              </SelectItem>
            )}
            {shelveData?.libraryShelves?.map((shelf) => (
              <SelectItem key={shelf.shelfId} value={shelf.shelfId.toString()}>
                {shelf.shelfNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            setEditMode(false)
            setSelectedShelf(undefined)
            if (setOpen) {
              setOpen(false)
            }
          }}
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={() => {
            onChange(selectedShelf)
            setShelfName(
              shelveData?.libraryShelves?.find(
                (s) => s.shelfId === selectedShelf
              )?.shelfNumber || ""
            )
            setEditMode(false)
            setSelectedShelf(undefined)
            if (setOpen) {
              setOpen(false)
            }
          }}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  )
}
