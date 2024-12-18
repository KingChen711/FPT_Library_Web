"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import {
  userDialogSchema,
  type TUserDialogSchema,
} from "@/lib/validations/auth/user-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UserDialogFormProps = {
  mode: "create" | "edit"
}

const UserDialogForm = ({ mode }: UserDialogFormProps) => {
  const tUserDialog = useTranslations("UserManagement.UserDialog")
  const tUserManagement = useTranslations("UserManagement")

  const [pending, startTransition] = useTransition()

  const form = useForm<TUserDialogSchema>({
    resolver: zodResolver(userDialogSchema),
    defaultValues: {
      role: "",
      email: "",
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      avatar: "",
      isActive: false,
      gender: "Male",
    },
  })

  const onSubmit = async (values: TUserDialogSchema) => {
    startTransition(async () => {
      console.log(values)
    })
  }

  const handleCancel = () => {
    form.reset()
  }

  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>
          <Plus size={16} />
          {mode === "create" ? tUserDialog("addUser") : tUserDialog("editUser")}
        </DialogTrigger>
      </Button>
      <DialogContent className="m-0 overflow-hidden p-0 pb-4">
        <DialogHeader className="w-full space-y-4 bg-primary p-4">
          <DialogTitle className="text-center text-primary-foreground">
            {mode === "create"
              ? tUserDialog("addUser")
              : tUserDialog("editUser")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container space-y-4 px-4"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("role")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("email")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter email"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("firstName")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter first name"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("lastName")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter last name"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("phone")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter phone number"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("dob")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="date"
                          disabled={pending}
                          {...field}
                          placeholder="Enter date of birth"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-1/3">
                      {tUserManagement("active")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <div className="flex w-full items-center justify-end gap-4">
              <Button disabled={pending} type="submit">
                {tUserDialog("saveBtn")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={pending}
                variant={"ghost"}
              >
                {tUserDialog("cancelBtn")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UserDialogForm
