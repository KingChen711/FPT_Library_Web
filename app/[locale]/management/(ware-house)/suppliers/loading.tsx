import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Skeleton className="h-8 w-[132px]" />
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-9 w-[130px]" />
          <Skeleton className="h-9 w-[146px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-[46px] w-full" />
        <Skeleton className="h-[46px] w-[220px]" />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        {Array(9)
          .fill(null)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="col-span-12 h-[288px] flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-4"
            />
          ))}
      </div>
    </div>
  )
}

export default Loading
