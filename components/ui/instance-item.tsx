"use client"

import { EllipsisVertical } from "lucide-react"
import Barcode from "react-barcode"

import { EBookCopyStatus } from "@/lib/types/enums"
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

import { Button } from "./button"

const InstanceItem = () => {
  // const router = useRouter()

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
            <TableHead className="text-center">Code</TableHead>
            <TableHead className="text-center">Barcode</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
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
              <TableCell>
                <div className="flex w-full justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Borrow</DropdownMenuItem>
                      <DropdownMenuItem>Locate</DropdownMenuItem>
                      <DropdownMenuItem>Detail</DropdownMenuItem>
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

export default InstanceItem
