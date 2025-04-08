"use client"

import React from "react"
import { type UntrainedGroup } from "@/queries/books/get-untrained-group"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  currentGroup: UntrainedGroup
  groups: UntrainedGroup[]
  setGroups: React.Dispatch<React.SetStateAction<UntrainedGroup[]>>
  disabled: boolean
}

function TrainCheckBox({ currentGroup, disabled, groups, setGroups }: Props) {
  return (
    <Checkbox
      disabled={disabled}
      checked={!!groups.find((g) => g.id === currentGroup.id)}
      onCheckedChange={(val) =>
        val
          ? setGroups((prev) => [...prev, currentGroup])
          : setGroups((prev) => prev.filter((g) => g.id !== currentGroup.id))
      }
      className="mt-4"
    />
  )
}

export default TrainCheckBox
