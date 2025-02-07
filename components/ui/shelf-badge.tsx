import React from "react"

import { Badge } from "./badge"

type Props = {
  shelfNumber: string
}

function ShelfBadge({ shelfNumber }: Props) {
  return (
    <Badge variant="draft" className="flex w-fit justify-center">
      {shelfNumber}
    </Badge>
  )
}

export default ShelfBadge
