import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

const AccountLoading = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

export default AccountLoading
