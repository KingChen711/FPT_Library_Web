import React from "react"

import { cn, formatFileSize } from "@/lib/utils"

type Props = {
  size: number
  className?: string
}

function FileSize({ size, className }: Props) {
  return <div className={cn(className)}>{formatFileSize(size)}</div>
}

export default FileSize
