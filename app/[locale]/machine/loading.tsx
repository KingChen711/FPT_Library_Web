import React from "react"
import { Loader2 } from "lucide-react"

function Loading() {
  return (
    <div className="flex size-full justify-center">
      <Loader2 className="size-9 animate-spin" />
    </div>
  )
}

export default Loading
