import React from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

import { Badge } from "./badge"

type Props = {
  objectUrl: File
}
const BookPreview = ({ objectUrl }: Props) => {
  return (
    <div className="mt-4 flex items-start justify-between gap-x-4 overflow-hidden rounded-md border p-4 shadow-lg">
      <div>
        <Image
          src={URL.createObjectURL(objectUrl)}
          alt="Selected Book"
          width={120}
          height={160}
          className="rounded object-cover"
        />
      </div>
      <div className="flex flex-1 items-start justify-between gap-y-2">
        <div className="flex-1 space-y-2">
          <h1 className="text-lg font-semibold text-primary">
            Dont make me think
          </h1>
          <p className="text-sm">by Steve Krug</p>
        </div>
        <div className="w-1/4 space-y-4">
          <Badge className="bg-success hover:bg-success">In-shelf</Badge>
          <div className="flex items-center gap-x-2">
            <MapPin size={16} color="orange" /> CS A-15
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookPreview
