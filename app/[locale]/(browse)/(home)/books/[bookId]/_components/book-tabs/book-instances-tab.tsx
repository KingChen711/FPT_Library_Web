"use client"

import { EllipsisVertical } from "lucide-react"
import Barcode from "react-barcode"

import { type LibraryItem } from "@/lib/types/models"
import BookCopyStatusBadge from "@/components/ui/book-copy-status-badge"
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

type Props = {
  libraryItemId: string
  libraryItem: LibraryItem
}

const BookInstancesTab = ({ libraryItemId, libraryItem }: Props) => {
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
                      value={instance.barcode as string}
                      width={1}
                      height={50}
                      fontSize={12}
                      displayValue={false}
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

export default BookInstancesTab
