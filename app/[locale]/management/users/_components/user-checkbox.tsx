"use client"

import { useManagementUsersStore } from "@/stores/users/use-management-user"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: string
}

function UserCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementUsersStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default UserCheckbox
