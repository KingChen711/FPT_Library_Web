import React from "react"
import { Loader2 } from "lucide-react"

function Loading() {
  return (
    <div className="mt-12 flex w-screen max-w-full justify-center">
      <Loader2 className="size-12 animate-spin" />
    </div>
  )
}

export default Loading
