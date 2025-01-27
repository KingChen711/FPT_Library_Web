"use client"

import Barcode from "react-barcode"

import { EBookCopyStatus } from "@/lib/types/enums"
import BookCopyStatusBadge from "@/components/ui/book-copy-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const BookInstancesTab = () => {
  const bookCopies = [
    { id: "C1", code: "D13892625321", status: EBookCopyStatus.IN_SHELF },
    { id: "C2", code: "D13892625322", status: EBookCopyStatus.BORROWED },
    { id: "C3", code: "D13892625323", status: EBookCopyStatus.DELETED },
    { id: "C4", code: "D13892625324", status: EBookCopyStatus.OUT_OF_SHELF },
    { id: "C5", code: "D13892625325", status: EBookCopyStatus.RESERVED },
  ]

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">STT</TableHead>
            <TableHead className="text-center">Mã từng cuốn sách</TableHead>
            <TableHead className="text-center">Barcode</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookCopies.map((book, index) => (
            <TableRow key={book.id}>
              <TableCell className="text-center font-medium">
                {book.id}
              </TableCell>
              <TableCell className="text-center">{book.code}</TableCell>
              <TableCell>
                <div className="flex w-full justify-center">
                  <Barcode
                    value={book.code}
                    width={1}
                    height={50}
                    fontSize={12}
                    displayValue={false}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-full justify-center">
                  <BookCopyStatusBadge status={book.status} />
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
