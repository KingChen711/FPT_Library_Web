"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { formUrlQuery } from "@/lib/utils"
import useShelfDetail from "@/hooks/shelf/use-shelf-detail"

import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./dialog"

type Props = {
  shelfId: number
  shelfNumber: string
  children: React.ReactNode
}

function LocateButton({ shelfId, shelfNumber, children }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const [openLocate, setOpenLocate] = useState(false)
  const t = useTranslations("LocateButton")

  const { data: shelfData, isFetching: fetchingShelfDetail } =
    useShelfDetail(shelfId)

  const handleLocate = () => {
    const newUrl = formUrlQuery({
      url: "/map",
      params: "",
      updates: {
        ref: `${shelfId};shelf;${shelfNumber}`,
      },
    })
    setOpenLocate(false)
    router.push(newUrl)
  }

  return (
    <>
      <Dialog open={openLocate} onOpenChange={setOpenLocate}>
        <DialogTrigger asChild>{children}</DialogTrigger>
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
              <Button onClick={handleLocate} className="flex-1 shrink-0">
                {t("Locate")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LocateButton
