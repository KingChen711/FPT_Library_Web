"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePathname } from "@/i18n/routing"
import { type TGetEmployeesData } from "@/queries/employees/get-employees"
import { ArrowDownUp, User } from "lucide-react"
import { useLocale } from "next-intl"

import { type Employee } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { EmployeeFilter } from "@/lib/validations/employee/employees-filter"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import EmployeeAction from "./employee-action"
import EmployeePagination from "./employee-pagination"
import EmployeeRowPage from "./employee-row-page"

type EmployyeeTableProps = {
  tableData: TGetEmployeesData
}

const EmployeeTable = ({ tableData }: EmployyeeTableProps) => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortParams = (key: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSort = params.get("sort")

    const newSort =
      currentSort === `-${key}` ? key : currentSort === key ? `-${key}` : key

    params.set("sort", newSort)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <Table className="border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead
                  className="flex items-center gap-x-2"
                  onClick={() => handleSortParams(EmployeeFilter.EMAIL)}
                >
                  Email <ArrowDownUp size={16} className="cursor-pointer" />
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.FIRST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    First name
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.LAST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Last name
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.EMPLOYEE_CODE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Employee Code
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.PHONE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Phone
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(EmployeeFilter.DOB)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Date of birth
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.GENDER)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Gender
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Hire date</TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.ROLE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Role
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.IS_ACTIVE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    Status
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl">
              {tableData.sources.map((employee: Employee, index: number) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Image
                        src={employee.avatar || "https://github.com/shadcn.png"}
                        alt="avatar"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <p>{employee.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    {employee?.dob && formatDate(employee?.dob)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {employee.gender === "Male" ? (
                        <User color="blue" />
                      ) : (
                        <User color="red" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{employee.address}</TableCell>
                  <TableCell>
                    {employee?.hireDate && formatDate(employee?.hireDate)}
                  </TableCell>
                  <TableCell>
                    {locale === "en"
                      ? employee.role.englishName
                      : employee.role.vietnameseName}
                  </TableCell>
                  <TableCell>
                    {employee.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <EmployeeAction employee={employee} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-end p-4">
        <div className="flex w-2/3 items-center justify-between">
          <EmployeePagination totalPages={tableData.totalPage} />
          <EmployeeRowPage />
        </div>
      </div>
    </div>
  )
}

export default EmployeeTable
