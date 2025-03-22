"use client"

import { EllipsisVertical } from "lucide-react"
import { useTranslations } from "next-intl"
import Barcode from "react-barcode"

import { type LibraryItem } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
            <TableHead className="text-center">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libraryItem.libraryItemInstances &&
            libraryItem.libraryItemInstances.map((instance) => (
              <TableRow key={instance.libraryItemInstanceId}>
                <TableCell className="text-center font-medium">
                  {instance.libraryItemInstanceId}
                </TableCell>
                <TableCell className="text-center">
                  {instance.barcode}
                </TableCell>
                <TableCell>
                  <div className="flex w-full justify-center">
                    <Barcode
                      value={instance.barcode}
                      width={1}
                      height={50}
                      fontSize={12}
                      // displayValue={false}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-full justify-center">
                    <BookCopyStatusBadge status={instance.status} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-full justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>{t("borrow")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("locate")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("detail")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
