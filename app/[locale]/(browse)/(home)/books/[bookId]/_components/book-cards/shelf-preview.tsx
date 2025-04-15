"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import useShelfDetail from "@/hooks/shelf/use-shelf-detail"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  shelfId: number
  children: React.ReactNode
}

function ShelfPreviewButton({ shelfId, children }: Props) {
  const locale = useLocale()
  const [openLocate, setOpenLocate] = useState(false)
  const t = useTranslations("LocateButton")

  const { data: shelfData, isFetching: fetchingShelfDetail } =
    useShelfDetail(shelfId)

  return (
    <>
      <Dialog open={openLocate} onOpenChange={setOpenLocate}>
        <DialogTrigger asChild className="cursor-pointer">
          {children}
        </DialogTrigger>
        <DialogContent className="max-h-[80dvh] w-[85vw] overflow-y-auto">
          {fetchingShelfDetail ? (
            <div className="items-center justify-center">
              <Loader2 className="size-12 animate-spin" />
            </div>
          ) : shelfData ? (
            <div>
              <div className="mb-1 font-bold">{t("Library item position")}</div>
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="font-bold">{t("Floor")}: </div>
                <div>{shelfData.floor.floorNumber}</div>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="font-bold">{t("Zone")}: </div>
                <div>
                  {locale === "vi"
                    ? shelfData.zone.vieZoneName
                    : shelfData.zone.engZoneName}
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="font-bold">{t("Section")}: </div>
                <div>
                  {locale === "vi"
                    ? shelfData.section.vieSectionName
                    : shelfData.section.engSectionName}
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="font-bold">{t("Shelf")}: </div>
                <div>{shelfData.libraryShelf.shelfNumber}</div>
              </div>
            </div>
          ) : (
            <div>{t("Not found")}</div>
          )}

          <DialogFooter>
            <div className="flex flex-row items-center gap-4">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 shrink-0">
                  {t("Cancel")}
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShelfPreviewButton
