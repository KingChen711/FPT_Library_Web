import { useTranslations } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import { type TUserDialogSchema } from "@/lib/validations/auth/user-dialog"
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

type UserDialogGenderProps = {
  form: UseFormReturn<TUserDialogSchema, unknown, undefined>
  fieldName: Extract<keyof TUserDialogSchema, "gender">
  formLabel: string
  pending: boolean
  selectPlaceholder: string
}

const UserDialogGender = ({
  form,
  pending,
  fieldName,
  formLabel,
  selectPlaceholder,
}: UserDialogGenderProps) => {
  const tGeneralManagement = useTranslations("GeneralManagement")

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
                  <SelectItem value="0">
                    {tGeneralManagement("fields.male")}
                  </SelectItem>
                  <SelectItem value="1">
                    {tGeneralManagement("fields.female")}
                  </SelectItem>
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

export default UserDialogGender
