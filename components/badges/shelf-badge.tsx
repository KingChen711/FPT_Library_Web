import React from "react"

import { Badge } from "../ui/badge"

type Props = {
  shelfNumber: string
}

function ShelfBadge({ shelfNumber }: Props) {
  return (
    <Badge variant="draft" className="flex w-[72px] justify-center">
      {shelfNumber}
    </Badge>
  )
}

export default ShelfBadge
