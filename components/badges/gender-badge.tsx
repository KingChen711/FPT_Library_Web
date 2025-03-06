import React from "react"

import { EGender, EIdxGender } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

import { Icons } from "../ui/icons"

type Props = {
  gender: EGender | EIdxGender
  className?: string
}

function GenderBadge({ gender, className }: Props) {
  if (gender === EGender.MALE || gender === EIdxGender.MALE) {
    return <Icons.Male className={cn("size-4", className)} />
  }

  return <Icons.Female className={cn("size-4", className)} />
}

export default GenderBadge
