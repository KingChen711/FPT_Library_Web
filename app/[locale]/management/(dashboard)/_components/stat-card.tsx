import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  title: string
  value: string | number
}
function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-md border p-4 shadow-md">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default StatCard

export function StatCardSkeleton() {
  return (
    <div className="rounded-md border p-4 shadow-md">
      <Skeleton className="h-5 w-full max-w-[140px]" />
      <Skeleton className="mt-1 h-7 w-12" />
    </div>
  )
}
