"use client"

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { updateEmployeeRole } from "@/actions/employees/update-employee-role"
import useEmployeeRoles from "@/hooks/employees/use-employee-roles"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  employee: Employee
}

const formSchema = z.object({
  roleId: z.number({ message: "required" }).optional(),
})

const EmployeeRoleChange = ({ open, setOpen, employee }: Props) => {
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")
  const tEmployeeManagement = useTranslations("EmployeeManagement")
  const [pending, startUpdateRole] = useTransition()
  const { data: employeeRoles, isLoading } = useEmployeeRoles()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: employee.role.roleId || undefined,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        roleId: employee.role.roleId || undefined,
      })
    }
  }, [employee.role.roleId, form, open])

  if (isLoading || !employeeRoles) return null

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    startUpdateRole(async () => {
      const res = await updateEmployeeRole(employee.employeeId, values.roleId!)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        form.reset(
          {
            roleId: employee.role.roleId || undefined,
          },
          {
            keepDefaultValues: true,
          }
        )
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">
            {tEmployeeManagement("update employee role")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Employee role</FormLabel> */}
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={tEmployeeManagement(
                            "choose employee role"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeRoles.map((role) => (
                          <SelectItem
                            key={role.roleId}
                            value={role.roleId.toString()}
                          >
                            {locale === "en"
                              ? role.englishName
                              : role.vietnameseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button
                className="flex-1"
                variant="secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                {tGeneralManagement("btn.cancel")}
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="flex-1"
                disabled={pending}
              >
                {tGeneralManagement("btn.save")}
                {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeRoleChange
