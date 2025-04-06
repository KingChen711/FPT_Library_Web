import React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"

function LoadingPage() {
  return (
    <div className="mt-4 pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-5 w-12" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-5 w-56" />
        </div>

        <Skeleton className="h-9 w-[900px] max-w-full" />
        <Skeleton className="mt-2 h-72 w-full" />

        <Skeleton className="mt-5 h-9 w-[160px] max-w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

export default LoadingPage
