// "use client"

// import { useEffect, useState, useTransition } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Loader2, Plus, SquarePen } from "lucide-react"
// import { useLocale, useTranslations } from "next-intl"
// import { useForm } from "react-hook-form"

// import handleServerActionError from "@/lib/handle-server-action-error"
// import { createEmployee } from "@/actions/employees/create-employee"
// import { updateEmployee } from "@/actions/employees/update-employee"
// import { toast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Form } from "@/components/ui/form"

// import AuthorDialogInput from "./author-dialog-input"

// type AuthorDialogFormProps = {
//   mode: "create" | "update"
//   employee?: AuthorDialogSchema
//   employeeId?: string
// }

// const AuthorDialogForm = ({
//   mode,
//   employee,
//   employeeId,
// }: AuthorDialogFormProps) => {
//   const locale = useLocale()
//   const [pending, startTransition] = useTransition()
//   const [isOpen, setOpen] = useState<boolean>(false)
//   const tEmployeeManagement = useTranslations("EmployeeManagement")
//   const tGeneralManagement = useTranslations("GeneralManagement")

//   const form = useForm<AuthorDialogSchema>({
//     resolver: zodResolver(authorDialogSchema),
//     defaultValues: {
//       employeeCode: employee?.employeeCode ?? "",
//       email: employee?.email ?? "",
//       firstName: employee?.firstName ?? "",
//       lastName: employee?.lastName ?? "",
//       dob: employee?.dob ?? "",
//       phone: employee?.phone ?? "",
//       address: employee?.address ?? "",
//       gender: employee?.gender ?? -1,
//       hireDate: employee?.hireDate ?? "",
//       roleId: employee?.roleId ?? -1,
//     },
//   })

//   useEffect(() => {
//     form.reset()
//     form.clearErrors()
//   }, [form, isOpen])

//   const onSubmit = async (values: authorDialogSchema) => {
//     startTransition(async () => {
//       const res =
//         mode === "create"
//           ? await createEmployee(values)
//           : await updateEmployee(employeeId as string, values)
//       if (res.isSuccess) {
//         toast({
//           title: locale === "vi" ? "Thành công" : "Success",
//           variant: "success",
//         })
//         setOpen(false)
//         return
//       }
//       handleServerActionError(res, locale, form)
//     })
//   }

//   const handleCancel = () => {
//     form.reset()
//     form.clearErrors()
//     setOpen(false)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(state) => setOpen(state)}>
//       {mode === "create" && (
//         <DialogTrigger asChild>
//           <Button>
//             <Plus size={16} />
//             {tEmployeeManagement("create employee")}
//           </Button>
//         </DialogTrigger>
//       )}

//       {mode === "update" && employee && (
//         <DialogTrigger asChild>
//           <div className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
//             <SquarePen size={16} /> {tEmployeeManagement("update employee")}
//           </div>
//         </DialogTrigger>
//       )}

//       <DialogContent className="m-0 overflow-hidden p-0 pb-4">
//         <DialogHeader className="w-full space-y-4 bg-primary p-4">
//           <DialogTitle className="text-center text-primary-foreground">
//             {mode === "create"
//               ? tEmployeeManagement("create employee")
//               : tEmployeeManagement("update employee")}
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="container h-[60vh] space-y-4 overflow-y-auto px-4"
//           >
//             <div className="space-y-2">
//               <AuthorDialogInput
//                 form={form}
//                 fieldName="employeeCode"
//                 pending={pending}
//                 formLabel={tGeneralManagement("fields.employeeCode")}
//                 inputPlaceholder={tGeneralManagement("placeholder.code")}
//               />
//               <AuthorDialogInput
//                 form={form}
//                 fieldName="email"
//                 pending={pending}
//                 inputType="email"
//                 formLabel={tGeneralManagement("fields.email")}
//                 inputPlaceholder={tGeneralManagement("placeholder.email")}
//               />
//             </div>

//             <div className="flex w-full items-center justify-end gap-4">
//               <Button disabled={pending} type="submit">
//                 {tGeneralManagement("btn.save")}
//                 {pending && <Loader2 className="size-4 animate-spin" />}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 disabled={pending}
//                 variant={"ghost"}
//               >
//                 {tGeneralManagement("btn.cancel")}
//                 {pending && <Loader2 className="size-4 animate-spin" />}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default AuthorDialogForm
