"use client"

import { useState } from "react"
import { CheckCircle, Printer, XCircle } from "lucide-react"

import BookAnimation from "@/components/ui/book-animation"
import { Button } from "@/components/ui/button"
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

import { borrowedListDummy } from "../../_components/borrowedListDummy"
import MachineHomeBtn from "../../_components/machine-home-btn"

const MachineBorrowPreview = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 rounded-md bg-background p-6">
        <MachineHomeBtn />
        <div className="flex flex-1 items-start justify-center gap-8">
          <div className="h-full w-1/5 space-y-4">
            <BookAnimation />
            <p className="text-center font-semibold">
              Đặt tài liệu vào khu vực đầu đọc
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-xl font-semibold">
              Danh sách tài liệu được mượn
            </h1>
            <Table className="overflow-hidden rounded-md border p-4 shadow-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Số lượng</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="w-[150px]">Hạn trả</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedListDummy.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <CheckCircle size={28} /> Hoàn thành
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn muốn in biên lai không?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-4">
            <Button
              variant={"outline"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <XCircle size={28} /> Không
            </Button>
            <Button className="flex items-center gap-2">
              <Printer size={28} /> In biên lai
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MachineBorrowPreview
