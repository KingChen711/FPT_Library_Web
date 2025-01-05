"use client"

import { useManagementAuthorsStore } from "@/stores/authors/use-management-authors"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: string
}

function AuthorCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementAuthorsStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default AuthorCheckbox
