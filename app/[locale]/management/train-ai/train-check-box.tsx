"use client"

import React from "react"
import { type UntrainedGroup } from "@/queries/books/get-untrained-group"
import { useUntrainedGroupsStore } from "@/stores/books/use-untrained-group"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  group: UntrainedGroup
  disabled: boolean
}

function TrainCheckBox({ group, disabled }: Props) {
  const { groups, add, remove } = useUntrainedGroupsStore()
  return (
    <Checkbox
      disabled={disabled}
      checked={!!groups.find((g) => g.id === group.id)}
      onCheckedChange={(val) => (val ? add(group) : remove(group.id))}
      className="mt-4"
    />
  )
}

export default TrainCheckBox
