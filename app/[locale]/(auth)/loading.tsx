import React from "react"
import Image from "next/image"
import systemLogo from "@/public/assets/images/logo.png"

import { Skeleton } from "@/components/ui/skeleton"

function AuthLoading() {
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={systemLogo}
            placeholder="blur"
            priority
            alt="Logo"
            width={72}
            height={72}
          />
          <div className="text-sm font-bold">Intelligent Library</div>
        </div>
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}

export default AuthLoading
