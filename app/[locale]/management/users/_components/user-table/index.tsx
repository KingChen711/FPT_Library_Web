"use client"

import { type Dispatch, type SetStateAction } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePathname } from "@/i18n/routing"
import { type TGetEmployeesData } from "@/queries/employees/get-employees"
import { ArrowDownUp, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Employee } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { EmployeeFilter } from "@/lib/validations/employee/employees-filter"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import EmployeeAction from "./user-action"
import EmployeePagination from "./user-pagination"
import EmployeeRowPage from "./user-row-page"

type EmployeeTableProps = {
  tableData: TGetEmployeesData
  selectedIds: string[]
  setSelectedIds: Dispatch<SetStateAction<string[]>>
}

const EmployeeTable = ({
  tableData,
  selectedIds,
  setSelectedIds,
}: EmployeeTableProps) => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()

  const handleSortParams = (key: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSort = params.get("sort")

    const newSort =
      currentSort === `-${key}` ? key : currentSort === key ? `-${key}` : key

    params.set("sort", newSort)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const isAllSelected =
    tableData.sources.length > 0 &&
    selectedIds.length === tableData.sources.length

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(tableData.sources.map((employee) => employee.employeeId))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    )
  }

  if (tableData.sources.length === 0) {
    return (
      <div className="p-4 text-center text-xl font-semibold text-destructive">
        {t("no data")}
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <Table className="border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>No</TableHead>
                <TableHead
                  className="flex items-center gap-x-2 text-nowrap"
                  onClick={() => handleSortParams(EmployeeFilter.EMAIL)}
                >
                  {t("fields.email")}{" "}
                  <ArrowDownUp size={16} className="cursor-pointer" />
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.FIRST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.firstName")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.LAST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.lastName")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.EMPLOYEE_CODE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.employeeCode")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.PHONE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.phone")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(EmployeeFilter.DOB)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.dob")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.GENDER)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.gender")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.ADDRESS)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.address")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.HIRE_DATE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.hireDate")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() =>
                    handleSortParams(EmployeeFilter.TERMINATION_DATE)
                  }
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.terminationDate")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.ROLE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.role")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(EmployeeFilter.ACTIVE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.status")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap"> {t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl">
              {tableData.sources.map((employee: Employee, index: number) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(employee.employeeId)}
                      onCheckedChange={() => toggleRow(employee.employeeId)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 pr-8">
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
                    <div className="flex items-center justify-center text-nowrap">
                      {employee.gender === "Male" ? (
                        <User color="blue" />
                      ) : (
                        <User color="red" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {employee.address}
                  </TableCell>
                  <TableCell>
                    {employee?.hireDate && formatDate(employee?.hireDate)}
                  </TableCell>
                  <TableCell>
                    {employee?.terminationDate &&
                      formatDate(employee?.terminationDate)}
                  </TableCell>
                  <TableCell>
                    {locale === "en"
                      ? employee.role.englishName
                      : employee.role.vietnameseName}
                  </TableCell>
                  <TableCell className="flex h-full items-center justify-center text-nowrap">
                    {employee.isActive ? (
                      <Badge className="h-full bg-success hover:bg-success">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="default" className="h-full">
                        Inactive
                      </Badge>
                    )}
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
