import React from "react"
import Image from "next/image"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import { Skeleton } from "@/components/ui/skeleton"

function AuthLoading() {
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image
            src={fptLogo}
            placeholder="blur"
            priority
            alt="Logo"
            width={120}
            height={48}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

export default AuthLoading
