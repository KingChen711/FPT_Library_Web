import React from "react"

import { Card } from "./card"
import { Skeleton } from "./skeleton"

function BrowseBookCardSkeleton() {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-md shadow-md transition-all duration-200 hover:shadow-lg">
      {/* Ảnh bìa */}
      <div className="relative flex aspect-[2.1/3] flex-1 items-center justify-center overflow-hidden rounded-t-md p-4">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-md p-4">
          <Skeleton className="size-full" />
        </div>
      </div>

      {/* Nội dung sách */}
      <div className="flex shrink-0 flex-col gap-1 p-3 pt-0">
        <Skeleton className="h-6 w-full" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/5" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-1/5" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  )
}

export default BrowseBookCardSkeleton
