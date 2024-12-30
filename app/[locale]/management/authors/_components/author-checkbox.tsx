"use client"

import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  id: string
}

function EmployeeCheckbox({ id }: Props) {
  const { selectedIds, toggleId } = useManagementEmployeesStore()

  return (
    <Checkbox
      onCheckedChange={() => toggleId(id)}
      checked={selectedIds.includes(id)}
    />
  )
}

export default EmployeeCheckbox
