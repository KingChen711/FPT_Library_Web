import React from "react"

import { cn } from "@/lib/utils"

type Props = {
  value: number | undefined | null
  size?: "default" | "lg"
}

function Rating({ value, size = "default" }: Props) {
  return (
    <div className={cn("flex min-w-20", size === "lg" && "min-w-32")}>
      <svg viewBox="0 0 1000 200" className="mb-0">
        <defs>
          <polygon
            id="star"
            points="100,0 131,66 200,76 150,128 162,200 100,166 38,200 50,128 0,76 69,66"
          />
          <clipPath id="stars">
            <use xlinkHref="#star" />
            <use xlinkHref="#star" x="20%" />
            <use xlinkHref="#star" x="40%" />
            <use xlinkHref="#star" x="60%" />
            <use xlinkHref="#star" x="80%" />
          </clipPath>
        </defs>

        <rect className="size-full fill-slate-300" clipPath="url(#stars)" />

        <rect
          width={(value || 0) * 20 + "%"}
          className="h-full fill-warning"
          clipPath="url(#stars)"
        />
      </svg>
    </div>
  )
}

export default Rating
