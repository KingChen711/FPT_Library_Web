import type { UseFormReturn } from "react-hook-form"

import { type TUserDialogSchema } from "@/lib/validations/auth/user-dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type UserDialogInputProps = {
  form: UseFormReturn<TUserDialogSchema, unknown, undefined>
  fieldName: keyof TUserDialogSchema
  formLabel: string
  pending: boolean
  inputType?: "text" | "number" | "email" | "password" | "date"
  inputPlaceholder: string
}

const UserDialogInput = ({
  form,
  fieldName,
  pending,
  formLabel,
  inputType = "text",
  inputPlaceholder,
}: UserDialogInputProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col justify-between">
            <div className="flex w-full justify-between gap-8">
              <FormLabel className="flex w-1/4 items-center text-nowrap">
                {formLabel}
              </FormLabel>
              <FormControl className="flex-1">
                <Input
                  type={inputType}
                  disabled={pending}
                  placeholder={inputPlaceholder}
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default UserDialogInput
