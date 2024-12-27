// import Image from "next/image"
// import { auth } from "@/queries/auth"
// import { User } from "lucide-react"
// import { getLocale } from "next-intl/server"

// import { getTranslations } from "@/lib/get-translations"
// import { EFeature } from "@/lib/types/enums"
// import { formatDate } from "@/lib/utils"
// import { searchEmployeesSchema } from "@/lib/validations/employee/search-employee"
// import { Badge } from "@/components/ui/badge"
// import Paginator from "@/components/ui/paginator"
// import SearchForm from "@/components/ui/search-form"
// import SortableTableHead from "@/components/ui/sortable-table-head"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// type Props = {
//   searchParams: {
//     search?: string
//     pageIndex?: string
//     pageSize?: string
//     sort?: string
//     isDeleted?: string
//     [key: string]: string | string[] | undefined
//   }
// }

// async function AuthorsManagementPage({ searchParams }: Props) {
//   const {
//     search,
//     pageIndex,
//     sort,
//     pageSize,
//     isDeleted = "false",
//     ...rest
//   } = searchEmployeesSchema.parse(searchParams)
//   await auth().protect(EFeature.EMPLOYEE_MANAGEMENT)
//   const locale = await getLocale()
//   const t = await getTranslations("GeneralManagement")

//   const [employeesData, employeeRoles] = await Promise.all([
//     getEmployees({
//       search,
//       pageIndex,
//       sort,
//       pageSize,
//       isDeleted,
//       ...rest,
//     }),
//     getEmployeeRoles(),
//   ])

//   console.log("🚀 ~ EmployeesManagementPage ~ employeesData:", employeesData)

//   return (
//     <div>
//       <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
//         <h3 className="text-2xl font-semibold">{t("employee management")}</h3>
//       </div>

//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex flex-row items-center">
//             <SearchForm
//               className="h-full rounded-r-none border-r-0"
//               search={search}
//             />
//             <FilterEmployeesDialog employeeRoles={employeeRoles} />
//           </div>

//           <SelectedEmployeeIdsIndicator />
//         </div>
//         <div className="flex flex-wrap items-center gap-x-4">
//           <EmployeeExport />
//           <EmployeeImportDialog />
//           <MutateEmployeeDialog type="create" employeeRoles={employeeRoles} />
//         </div>
//       </div>

//       <div className="mt-4 grid w-full">
//         <div className="overflow-x-auto rounded-md border">
//           <div className="flex items-center justify-between p-4 pl-0">
//             <EmployeeHeaderTab />
//             <EmployeeRangeControl />
//           </div>
//           <Table className="overflow-hidden">
//             <TableHeader className="">
//               <TableRow className="">
//                 <TableHead></TableHead>
//                 <SortableTableHead
//                   currentSort={sort}
//                   label="Email"
//                   sortKey="email"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.firstName")}
//                   sortKey="firstName"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.lastName")}
//                   sortKey="lastName"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.employeeCode")}
//                   sortKey="employeeCode"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.phone")}
//                   sortKey="phone"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.dob")}
//                   sortKey="dob"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.gender")}
//                   sortKey="gender"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.address")}
//                   sortKey="address"
//                 />
//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.hireDate")}
//                   sortKey="hireDate"
//                 />

//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.terminationDate")}
//                   sortKey="terminationDate"
//                 />

//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.role")}
//                   sortKey="role"
//                 />

//                 <SortableTableHead
//                   currentSort={sort}
//                   label={t("fields.active")}
//                   sortKey="isActive"
//                 />

//                 <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
//                   {t("action")}
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {employeesData?.sources?.map((employee) => (
//                 <TableRow key={employee.employeeId}>
//                   <TableCell>
//                     <EmployeeCheckbox id={employee.employeeId} />
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2 pr-8">
//                       <Image
//                         src={employee.avatar || "https://github.com/shadcn.png"}
//                         alt="avatar"
//                         width={20}
//                         height={20}
//                         className="rounded-full"
//                       />
//                       <p>{employee.email}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>{employee.firstName}</TableCell>
//                   <TableCell>{employee.lastName}</TableCell>
//                   <TableCell>{employee.employeeCode}</TableCell>
//                   <TableCell>{employee.phone}</TableCell>
//                   <TableCell>
//                     {employee?.dob && formatDate(employee?.dob)}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex items-center justify-center text-nowrap">
//                       {employee.gender === "Male" ? (
//                         <User color="blue" />
//                       ) : (
//                         <User color="red" />
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-nowrap">
//                     {employee.address}
//                   </TableCell>
//                   <TableCell>
//                     {employee?.hireDate && formatDate(employee?.hireDate)}
//                   </TableCell>
//                   <TableCell>
//                     {employee?.terminationDate
//                       ? formatDate(employee?.terminationDate)
//                       : "__"}
//                   </TableCell>

//                   <TableCell>
//                     {locale === "en"
//                       ? employee.role.englishName
//                       : employee.role.vietnameseName}
//                   </TableCell>

//                   <TableCell>
//                     {employee.isActive ? (
//                       <Badge className="h-full bg-success hover:bg-success">
//                         {t("fields.active")}
//                       </Badge>
//                     ) : (
//                       <Badge variant="default" className="h-full">
//                         {t("fields.inactive")}
//                       </Badge>
//                     )}
//                   </TableCell>

//                   <TableCell className="flex justify-center">
//                     <EmployeeActionDropdown
//                       employee={employee}
//                       employeeRoles={employeeRoles}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         <Paginator
//           pageSize={+pageSize}
//           pageIndex={pageIndex}
//           totalActualItem={employeesData.totalActualItem}
//           totalPage={employeesData.totalPage}
//           className="mt-6"
//         />
//       </div>
//     </div>
//   )
// }

// export default AuthorsManagementPage
