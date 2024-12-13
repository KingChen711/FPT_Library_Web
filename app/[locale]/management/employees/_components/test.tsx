import Image from "next/image"
import { type TGetEmployeesData } from "@/queries/employees/get-employees"
import {
  EyeOff,
  MoreHorizontal,
  SquarePen,
  Trash,
  User,
  User2,
} from "lucide-react"
import { getLocale } from "next-intl/server"

import { type Employee } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import EmployeePagination from "./employee-pagination"
import EmployeeRowPage from "./employee-row-page"
import { studentDummy } from "./student-dummy"

type EmployyeeTableProps = {
  tableData: TGetEmployeesData
}

const EmployeeTable = async ({ tableData }: EmployyeeTableProps) => {
  console.log("🚀 ~ EmployeeTable ~ tableData:", tableData)
  const locale = await getLocale()

  return (
    <div>
      <div className="my-4 grid w-full">
        <div className="overflow-hidden overflow-x-auto rounded-lg border">
          <Table className="table-fixed rounded-lg shadow-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky -left-0 z-10 w-72 border bg-primary-foreground text-center font-semibold">
                  No
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Email
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  First name
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Last name
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Employee Code
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Phone
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Date of birth
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Gender
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Address
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Hire date
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Role
                </TableHead>
                <TableHead className="w-[400px] text-center font-semibold">
                  Action
                </TableHead>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex size-8 w-full justify-center p-0"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-primary-foreground"
                      >
                        <DropdownMenuItem className="cursor-pointer">
                          <SquarePen /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <User2 /> Change role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <EyeOff /> De-activate user
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Trash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
