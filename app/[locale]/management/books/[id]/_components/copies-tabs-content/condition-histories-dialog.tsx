import React from "react"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { type EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Condition, type ConditionHistory } from "@/lib/types/models"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  histories: (ConditionHistory & { condition: Condition })[]
}

function ConditionHistoriesDialog({ open, setOpen, histories }: Props) {
  const t = useTranslations("BooksManagementPage")
  const formatLocale = useFormatLocale()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Condition histories")}</DialogTitle>
          <DialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Condition")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Date")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.map((history) => (
                  <TableRow key={history.conditionHistoryId}>
                    <TableCell>
                      <BookConditionStatusBadge
                        status={
                          history.condition
                            .englishName as EBookCopyConditionStatus
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {format(history.createdAt, "dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ConditionHistoriesDialog
