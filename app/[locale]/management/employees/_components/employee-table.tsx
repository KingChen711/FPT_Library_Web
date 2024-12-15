import Image from "next/image"
import { type TGetEmployeesData } from "@/queries/employees/get-employees"
import { User } from "lucide-react"
import { getLocale } from "next-intl/server"

import { type Employee } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
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

const EmployeeTable = async ({ tableData }: EmployyeeTableProps) => {
  const locale = await getLocale()

  return (
    <div>
      <div className="my-4 grid w-full">
        <div className="relative overflow-x-auto">
          <Table className="mb-2 border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date of birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Hire date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active</TableHead>
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
