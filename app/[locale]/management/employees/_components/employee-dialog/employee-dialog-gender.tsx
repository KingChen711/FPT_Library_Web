import type { UseFormReturn } from "react-hook-form"

import type { TEmployeeDialogSchema } from "@/lib/validations/employee/employee-dialog"
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

type EmployeeDialogGenderProps = {
  form: UseFormReturn<TEmployeeDialogSchema, unknown, undefined>
  fieldName: Extract<keyof TEmployeeDialogSchema, "gender">
  formLabel: string
  pending: boolean
  selectPlaceholder: string
}

const EmployeeDialogGender = ({
  form,
  pending,
  fieldName,
  formLabel,
  selectPlaceholder,
}: EmployeeDialogGenderProps) => {
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
                  <SelectItem value="0">Male</SelectItem>
                  <SelectItem value="1">Female</SelectItem>
                  <SelectItem value="2">Other</SelectItem>
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

export default EmployeeDialogGender
