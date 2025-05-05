import React from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PaginatorSkeleton } from "@/components/ui/paginator"
import { SearchFormSkeleton } from "@/components/ui/search-form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function Loading() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Skeleton className="h-8 w-[164px]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchFormSkeleton />
            <Skeleton className="h-10 w-[97px]" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-[143px]" />
        </div>
      </div>

      <div className="mb-6 mt-4 grid w-full rounded-md border">
        <div className="overflow-x-auto rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-9 rounded"></Skeleton>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-9 rounded"></Skeleton>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-9 rounded"></Skeleton>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginatorSkeleton />
    </div>
  )
}

export default Loading
