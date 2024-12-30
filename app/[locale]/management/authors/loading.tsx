import React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function ManagementAuthorsLoading() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="my-4 grid w-full">
        <div className="relative overflow-x-auto">
          <Table className="mb-2 border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-9 w-24" />
                </TableHead>
                {[...Array(9)].map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-9 w-32" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl bg-card">
              {[...Array(4)].map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {[...Array(10)].map((_, colIdx) => (
                    <TableCell key={colIdx} className="w-[200px]">
                      <Skeleton className="h-9 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default ManagementAuthorsLoading
