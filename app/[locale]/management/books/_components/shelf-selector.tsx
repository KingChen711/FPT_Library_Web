"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import useFloors from "@/hooks/shelf/use-floors"
import useSections from "@/hooks/shelf/use-sections"
import useShelves from "@/hooks/shelf/use-shelves"
import useZones from "@/hooks/shelf/use-zones"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ShelfBadge from "@/components/ui/shelf-badge"

type Props = {
  initShelfName: string | undefined
  onChange: (val: number | undefined) => void
}

export default function ShelfSelector({ onChange, initShelfName }: Props) {
  const t = useTranslations("BooksManagementPage")

  const [editMode, setEditMode] = useState(false)
  const [shelfName, setShelfName] = useState(initShelfName)

  const [selectedFloor, setSelectedFloor] = useState<number | undefined>(
    undefined
  )
  const [selectedZone, setSelectedZone] = useState<number | undefined>(
    undefined
  )
  const [selectedSection, setSelectedSection] = useState<number | undefined>(
    undefined
  )
  const [selectedShelf, setSelectedShelf] = useState<number | undefined>(
    undefined
  )

  const { data: floors, isFetching: fetchingFloors } = useFloors()
  const { data: zones, isFetching: fetchingZones } = useZones(selectedFloor)
  const { data: sections, isFetching: fetchingSections } =
    useSections(selectedZone)
  const { data: shelves, isFetching: fetchingShelves } =
    useShelves(selectedZone)

  useEffect(() => {
    setSelectedZone(undefined)
    setSelectedSection(undefined)
    setSelectedShelf(undefined)
  }, [selectedFloor, setSelectedShelf])

  useEffect(() => {
    setSelectedSection(undefined)
    setSelectedShelf(undefined)
  }, [selectedZone, setSelectedShelf])

  useEffect(() => {
    setSelectedShelf(undefined)
  }, [selectedSection, setSelectedShelf])

  if (!editMode) {
    return (
      <div className="flex items-center gap-2">
        {shelfName ? <ShelfBadge shelfNumber={shelfName} /> : <NoData />}
        <Pencil
          className="size-4 cursor-pointer hover:text-primary"
          onClick={() => setEditMode(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4 pt-5">
      <div className="flex flex-col gap-y-2">
        <Label>{t("Floor")}</Label>
        <Select onValueChange={(value) => setSelectedFloor(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={t("Select floor")} />
          </SelectTrigger>
          <SelectContent>
            {fetchingFloors && (
              <SelectItem value="loader" disabled className="text-center">
                <Loader2 className="animate-spin" />
              </SelectItem>
            )}
            {floors?.length === 0 && (
              <SelectItem value="no-data" disabled className="text-center">
                <NoData />
              </SelectItem>
            )}
            {floors?.map((floor) => (
              <SelectItem key={floor.floorId} value={floor.floorId.toString()}>
                {floor.floorNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{t("Zone")}</Label>
        <Select
          onValueChange={(value) => setSelectedZone(Number(value))}
          disabled={!selectedFloor}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select zone")} />
          </SelectTrigger>
          <SelectContent>
            {fetchingZones && (
              <SelectItem value="loader" disabled className="text-center">
                <Loader2 className="animate-spin" />
              </SelectItem>
            )}
            {zones?.length === 0 && (
              <SelectItem value="no-data" disabled className="text-center">
                <NoData />
              </SelectItem>
            )}
            {zones?.map((zone) => (
              <SelectItem key={zone.zoneId} value={zone.zoneId.toString()}>
                {zone.zoneName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{t("Section")}</Label>
        <Select
          onValueChange={(value) => setSelectedSection(Number(value))}
          disabled={!selectedZone}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select section")} />
          </SelectTrigger>
          <SelectContent>
            {fetchingSections && (
              <SelectItem value="loader" disabled className="text-center">
                <Loader2 className="animate-spin" />
              </SelectItem>
            )}
            {sections?.length === 0 && (
              <SelectItem value="no-data" disabled className="text-center">
                <NoData />
              </SelectItem>
            )}
            {sections?.map((section) => (
              <SelectItem
                key={section.sectionId}
                value={section.sectionId.toString()}
              >
                {section.sectionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{t("Shelf")}</Label>
        <Select
          onValueChange={(value) => setSelectedShelf(Number(value))}
          disabled={!selectedSection}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select shelf")} />
          </SelectTrigger>
          <SelectContent>
            {fetchingShelves && (
              <SelectItem value="loader" disabled className="text-center">
                <Loader2 className="animate-spin" />
              </SelectItem>
            )}
            {shelves?.length === 0 && (
              <SelectItem value="no-data" disabled className="text-center">
                <NoData />
              </SelectItem>
            )}
            {shelves?.map((shelf) => (
              <SelectItem key={shelf.shelfId} value={shelf.shelfId.toString()}>
                {shelf.shelfNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            setEditMode(false)
            setSelectedFloor(undefined)
            setSelectedZone(undefined)
            setSelectedSection(undefined)
            setSelectedShelf(undefined)
          }}
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={() => {
            onChange(selectedShelf)
            setShelfName(
              shelves?.find((s) => s.shelfId === selectedShelf)?.shelfNumber ||
                ""
            )
            setEditMode(false)
            setSelectedFloor(undefined)
            setSelectedZone(undefined)
            setSelectedSection(undefined)
            setSelectedShelf(undefined)
          }}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  )
}
