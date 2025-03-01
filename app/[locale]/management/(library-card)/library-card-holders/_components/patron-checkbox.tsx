"use client"

import React from "react"
import { useManagementPatronsStore } from "@/stores/patrons/use-management-patrons"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: string
}

function PatronCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementPatronsStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default PatronCheckbox
