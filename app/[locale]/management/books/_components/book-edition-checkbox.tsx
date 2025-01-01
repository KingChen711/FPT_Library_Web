"use client"

import React from "react"
import { useManagementBookEditionsStore } from "@/stores/books/use-management-book-editions"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: number
}

function BookEditionCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementBookEditionsStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default BookEditionCheckbox
