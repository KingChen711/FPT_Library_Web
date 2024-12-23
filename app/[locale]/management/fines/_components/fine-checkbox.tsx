"use client"

import React from "react"
import { useManagementFinesStore } from "@/stores/fines/use-management-fines"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: number
}

function FineCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementFinesStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default FineCheckbox
