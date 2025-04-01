"use client"

import { useState } from "react"
import { CheckCircle, FolderSync, Printer, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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

const MachineExtendPreview = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id) // Bỏ chọn
      } else {
        newSet.add(id) // Chọn
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (checkedItems.size === borrowedListDummy.length) {
      setCheckedItems(new Set()) // Bỏ chọn tất cả
    } else {
      setCheckedItems(new Set(borrowedListDummy.map((item) => item.id))) // Chọn tất cả
    }
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 rounded-md bg-background p-6">
        <MachineHomeBtn />
        <div className="flex flex-1 items-start justify-center gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-xl font-semibold">
              Gia hạn tài liệu &nbsp;
              {checkedItems.size > 0 && `(${checkedItems.size})`}
            </h1>
            <Table className="overflow-hidden rounded-md border p-4 shadow-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Làm mới</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="w-[150px]">Hạn trả</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedListDummy.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => handleCheckboxChange(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Label
                        htmlFor={`check-${item.id}`}
                        className="font-normal hover:underline"
                      >
                        {item.title}
                      </Label>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <Button
          variant={"outline"}
          onClick={() => handleSelectAll()}
          className="flex items-center gap-2"
        >
          <FolderSync size={28} />
          {checkedItems.size === borrowedListDummy.length
            ? "Bỏ gia hạn tất cả "
            : "Gia hạn tất cả "}
          {checkedItems.size > 0 && `(${checkedItems.size})`}
        </Button>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
          disabled={checkedItems.size === 0}
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

export default MachineExtendPreview
