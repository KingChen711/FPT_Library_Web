"use client"

import { useTranslations } from "next-intl"

import { type LibraryItem } from "@/lib/types/models"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BookCopyStatusBadge from "@/components/badges/book-copy-status-badge"

type Props = {
  libraryItem: LibraryItem
}

const BookInstancesTab = ({ libraryItem }: Props) => {
  const t = useTranslations("BookPage")

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">
              {t("ordinal number")}
            </TableHead>
            <TableHead className="text-center">{t("code")}</TableHead>
            <TableHead className="text-center">{t("barcode")}</TableHead>
            <TableHead className="text-center">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libraryItem.libraryItemInstances &&
            libraryItem.libraryItemInstances.map((instance, index) => (
              <TableRow key={instance.libraryItemInstanceId}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center">
                  {instance.barcode}
                </TableCell>
                <TableCell>
                  <div className="flex w-full justify-center">
                    <BarcodeGenerator
                      options={{
                        width: 2,
                        height: 26,
                        fontSize: 16,
                      }}
                      value={instance.barcode}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-full justify-center">
                    <BookCopyStatusBadge status={instance.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BookInstancesTab
