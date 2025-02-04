import React from "react"

type Props = {
  value: number | undefined | null
}

function Rating({ value }: Props) {
  return (
    <div className="flex min-w-20">
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
          className="h-full fill-[#eab308]"
          clipPath="url(#stars)"
        />
      </svg>
    </div>
  )
}

export default Rating
