"use client"

import { type ReactNode } from "react"
import { ReadMoreWeb } from "react-shorten"

type Props = {
  truncate: number
  children: ReactNode
}

export const StyledReadMore = ({ truncate, children }: Props) => (
  <div className="mt-2">
    <ReadMoreWeb
      truncate={truncate}
      showMoreText="Show more"
      showLessText="Show less"
      className="m-0 inline cursor-pointer bg-none p-0 text-justify text-sm text-danger"
    >
      <span className="mt-2 text-justify text-sm">{children}</span>
      {/* <div
        className="line-clamp-1 max-w-[260px] flex-1 text-ellipsis"
        dangerouslySetInnerHTML={{ __html: children }}
      /> */}
    </ReadMoreWeb>
  </div>
)
