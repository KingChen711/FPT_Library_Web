"use client"

import React, { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { EFineType } from "@/lib/types/enums"
import { type Fine } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import useFines from "@/hooks/fines/use-fines"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Paginator from "@/components/ui/paginator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FineTypeBadge from "@/components/badges/fine-type-badge"

type Props = {
  onSelect: (Fine: Fine) => void
  disabled?: boolean
  disableFineIds?: number[]
  isLost?: boolean
  isOverdue?: boolean
}

function SelectFinesDialog({
  onSelect,
  disabled = false,
  disableFineIds = [],
  isLost,
  isOverdue,
}: Props) {
  const t = useTranslations("FinesManagementPage")
  const [open, setOpen] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const { data, isLoading } = useFines({
    pageIndex,
    pageSize,
  })

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Plus />
          {t("Add fine")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t("Fines")}</DialogTitle>
          <DialogDescription asChild>
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-row items-center">
                    {/* <SearchForm search={search} /> */}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid w-full">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="size-9 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="overflow-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-nowrap font-bold">
                            {t("Title")}
                          </TableHead>
                          <TableHead className="text-nowrap font-bold">
                            <div className="flex justify-center">
                              {t("Condition type")}
                            </div>
                          </TableHead>
                          <TableHead className="text-nowrap font-bold">
                            {t("Description")}
                          </TableHead>
                          <TableHead className="text-nowrap font-bold">
                            <div className="flex justify-center">
                              {t("Charge pct")}
                            </div>
                          </TableHead>
                          <TableHead className="text-nowrap font-bold">
                            <div className="flex justify-center">
                              {t("Processing fee")}
                            </div>
                          </TableHead>
                          <TableHead className="text-nowrap font-bold">
                            <div className="flex justify-center">
                              {t("Daily rate")}
                            </div>
                          </TableHead>
                          <TableHead className="text-nowrap font-bold"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.sources.map((fine) => (
                          <TableRow key={fine.finePolicyId}>
                            <TableCell className="text-nowrap">
                              {fine.finePolicyTitle}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <FineTypeBadge type={fine.conditionType} />
                              </div>
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fine.description}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fine.chargePct
                                ? Math.floor(fine.chargePct * 100) + "%"
                                : "-"}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fine.processingFee
                                ? formatPrice(fine.processingFee)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fine.dailyRate
                                ? formatPrice(fine.dailyRate)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Button
                                  disabled={
                                    disableFineIds.includes(
                                      fine.finePolicyId
                                    ) ||
                                    (isLost &&
                                      fine.conditionType !== EFineType.LOST) ||
                                    (isLost === false &&
                                      fine.conditionType === EFineType.LOST) ||
                                    (isOverdue === false &&
                                      fine.conditionType === EFineType.OVER_DUE)
                                  }
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onSelect(fine)
                                    setOpen(false)
                                  }}
                                  size="sm"
                                  className="w-[108px]"
                                >
                                  {disableFineIds.includes(fine.finePolicyId)
                                    ? t("Selected")
                                    : (isLost &&
                                          fine.conditionType !==
                                            EFineType.LOST) ||
                                        (isLost === false &&
                                          fine.conditionType ===
                                            EFineType.LOST) ||
                                        (isOverdue === false &&
                                          fine.conditionType ===
                                            EFineType.OVER_DUE)
                                      ? t("Not valid")
                                      : t("Select")}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {data && (
                  <Paginator
                    pageSize={+pageSize}
                    pageIndex={pageIndex}
                    totalPage={data.totalPage}
                    totalActualItem={data.totalActualItem}
                    className="mt-6"
                    onPaginate={handlePaginate}
                    onChangePageSize={handleChangePageSize}
                  />
                )}
              </div>
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SelectFinesDialog
