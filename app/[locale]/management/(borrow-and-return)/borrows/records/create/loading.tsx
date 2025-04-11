import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Skeleton className="h-8 w-[164px]" />
        <Skeleton className="h-6 w-[145px]" />
      </div>

      <Skeleton className="h-[244px] w-full" />
    </div>
  )
}

export default Loading
