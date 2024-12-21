"use client"

import { Loader2 } from "lucide-react"
import { useLocale } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import type { TEmployeeDialogSchema } from "@/lib/validations/employee/employee-dialog"
import useEmployeeRoles from "@/hooks/employees/use-employee-roles"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type EmployeeDialogRoleProps = {
  form: UseFormReturn<TEmployeeDialogSchema, unknown, undefined>
  fieldName: Extract<keyof TEmployeeDialogSchema, "roleId">
  formLabel: string
  pending: boolean
  selectPlaceholder: string
}

const EmployeeDialogRole = ({
  form,
  pending,
  fieldName,
  formLabel,
  selectPlaceholder,
}: EmployeeDialogRoleProps) => {
  const locale = useLocale()
  const { data: employeeRolesData, isLoading } = useEmployeeRoles()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col justify-between">
          <div className="flex w-full justify-between gap-8">
            <FormLabel className="flex w-1/4 items-center text-nowrap">
              {formLabel}
            </FormLabel>
            <FormControl className="flex-1">
              <Select
                {...field}
                disabled={pending}
                value={field.value !== -1 ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={selectPlaceholder}>
                    {field.value === -1 ? selectPlaceholder : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {employeeRolesData?.map((role) => (
                    <SelectItem
                      key={role.roleId}
                      value={role.roleId.toString()}
                    >
                      {locale === "vi" ? role.vietnameseName : role.englishName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default EmployeeDialogRole
