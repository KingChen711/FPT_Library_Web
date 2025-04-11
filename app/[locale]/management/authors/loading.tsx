import React from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

function ManagementAuthorsLoading() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Skeleton className="h-8 w-[120px]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchFormSkeleton />
            <Skeleton className="h-10 w-[97px]" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-[136px]" />
        </div>
      </div>

      <div className="mb-6 mt-4 rounded-md border p-4">
        {/* tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-[42px] w-[120px]" />
            <Skeleton className="h-[42px] w-[120px]" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4">
            <Skeleton className="h-9 w-[120px]" />
            <Skeleton className="h-9 w-[130px]" />
            <Skeleton className="h-9 w-[134px]" />
          </div>
        </div>

        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
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
                      <Checkbox />
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
      </div>

      <PaginatorSkeleton />
    </div>
  )
}

export default ManagementAuthorsLoading
