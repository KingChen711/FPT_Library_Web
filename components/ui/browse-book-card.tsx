import React from "react"

import { cn } from "@/lib/utils"

import { Card } from "./card"
import { Skeleton } from "./skeleton"

type Props = {
  className?: string
}

function BrowseBookCardSkeleton({ className }: Props) {
  return (
    <Card
      className={cn(
        "group h-[392px] w-full cursor-pointer overflow-hidden rounded-md transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      {/* Ảnh bìa */}
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-t-md p-4">
        <div className="relative h-[240px] w-[160px] overflow-hidden rounded-md">
          <Skeleton className="size-full" />
        </div>
      </div>

      {/* Nội dung sách */}
      <div className="flex flex-col gap-1 p-2 text-left text-sm">
        <Skeleton className="h-5 w-full" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/5" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-1/5" />
        </div>
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  )
}

export default BrowseBookCardSkeleton
