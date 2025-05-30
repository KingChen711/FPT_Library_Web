import defaultAvatar from "@/public/assets/images/default-avatar.jpg"
import { auth } from "@/queries/auth"
import getEmployees from "@/queries/employees/get-employees"
import getEmployeeRoles from "@/queries/roles/get-employee-roles"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature, EGender } from "@/lib/types/enums"
import { formatDate } from "@/lib/utils"
import { searchEmployeesSchema } from "@/lib/validations/employee/search-employee"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import EmployeeActionDropdown from "./_components/employee-action-dropdown"
import EmployeeCheckbox from "./_components/employee-checkbox"
import EmployeeExport from "./_components/employee-export"
import EmployeeHeaderTab from "./_components/employee-header-tab"
import EmployeeImportDialog from "./_components/employee-import-dialog"
import EmployeeRangeControl from "./_components/employee-range-control"
import FilterEmployeesDialog from "./_components/filter-employees-dialog"
import MutateEmployeeDialog from "./_components/mutate-employee-dialog"
import SelectedEmployeeIdsIndicator from "./_components/selected-employee-ids-indicator"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
    isDeleted?: string
    [key: string]: string | string[] | undefined
  }
}

async function EmployeesManagementPage({ searchParams }: Props) {
  const {
    search,
    pageIndex,
    sort,
    pageSize,
    isDeleted = "false",
    ...rest
  } = searchEmployeesSchema.parse(searchParams)
  await auth().protect(EFeature.EMPLOYEE_MANAGEMENT)
  const locale = await getLocale()
  const t = await getTranslations("GeneralManagement")

  const [employeesData, employeeRoles] = await Promise.all([
    getEmployees({
      search,
      pageIndex,
      sort,
      pageSize,
      isDeleted,
      ...rest,
    }),
    getEmployeeRoles(),
  ])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("employee management")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FilterEmployeesDialog />
          </div>

          <SelectedEmployeeIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <EmployeeExport />
          <EmployeeImportDialog />
          <MutateEmployeeDialog type="create" employeeRoles={employeeRoles} />
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <div className="flex items-center justify-between p-4 pl-0">
            <EmployeeHeaderTab />
            <EmployeeRangeControl />
          </div>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label="Email"
                  sortKey="email"
                  classname="text-nowrap w-[400px]"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.firstName")}
                  sortKey="firstName"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.lastName")}
                  sortKey="lastName"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.employeeCode")}
                  sortKey="employeeCode"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.phone")}
                  sortKey="phone"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.dob")}
                  sortKey="dob"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.gender")}
                  sortKey="gender"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.address")}
                  sortKey="address"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.hireDate")}
                  sortKey="hireDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.terminationDate")}
                  sortKey="terminationDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.role")}
                  sortKey="role"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.active")}
                  sortKey="isActive"
                />

                <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                  {t("action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData?.sources?.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>
                    <EmployeeCheckbox id={employee.employeeId} />
                  </TableCell>
                  <TableCell className="">
                    <div className="flex min-w-[240px] items-center">
                      <ImageWithFallback
                        src={employee.avatar || defaultAvatar}
                        alt={`${employee.lastName} ${employee.firstName}`}
                        width={36}
                        height={36}
                        fallbackSrc={defaultAvatar}
                        className="mr-2 size-9 shrink-0 rounded-full"
                      />
                      <p className="truncate" title={employee.email}>
                        {employee.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {employee.firstName}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    {employee?.dob && formatDate(employee?.dob)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center text-nowrap">
                      {employee.gender === EGender.MALE ? (
                        <Icons.Male />
                      ) : (
                        <Icons.Female />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {employee.address || "__"}
                  </TableCell>
                  <TableCell>
                    {employee?.hireDate && formatDate(employee?.hireDate)}
                  </TableCell>
                  <TableCell>
                    {employee?.terminationDate
                      ? formatDate(employee?.terminationDate)
                      : "__"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {locale === "en"
                      ? employee.role.englishName
                      : employee.role.vietnameseName}
                  </TableCell>

                  <TableCell>
                    {employee.isActive ? (
                      <Badge className="flex h-full w-[100px] justify-center text-nowrap bg-success text-center hover:bg-success">
                        {t("fields.active")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="flex h-full w-[100px] justify-center text-nowrap text-center"
                      >
                        {t("fields.inactive")}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <EmployeeActionDropdown
                      employee={employee}
                      employeeRoles={employeeRoles}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalActualItem={employeesData.totalActualItem}
          totalPage={employeesData.totalPage}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default EmployeesManagementPage
