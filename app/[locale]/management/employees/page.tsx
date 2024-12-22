import { auth } from "@/queries/auth"
import { getEmployees } from "@/queries/employees/get-employees"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import EmployeeContainer from "./_components/employee-container"
import EmployeeDialogForm from "./_components/employee-dialog"
import EmployeeDialogImport from "./_components/employee-dialog-import"
import EmployeeExport from "./_components/employee-export"

enum EmployeeGender {
  Male = "Male",
  Female = "Female",
}

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGE_SIZE = 5

const employeeManagementSchema = z.object({
  employeeCode: z.string().trim().optional(),
  roleId: z.string().trim().optional(),
  gender: z.nativeEnum(EmployeeGender).optional(),
  isActive: z.string().trim().optional(),
  pageIndex: z.coerce.number().catch(DEFAULT_PAGE_INDEX),
  pageSize: z.coerce.number().catch(DEFAULT_PAGE_SIZE),
  search: z.string().trim().optional(),
  sort: z.string().trim().optional(),
  isDeleted: z.string().trim().optional(),
  dobRange: z.array(z.string().trim()).optional().catch([]),
  createDateRange: z.array(z.string().trim()).optional().catch([]),
  modifiedDateRange: z.array(z.string().trim()).optional().catch([]),
  hireDateRange: z.array(z.string().trim()).optional().catch([]),
})

type EmployeeManagementPageProps = {
  searchParams: Partial<z.infer<typeof employeeManagementSchema>>
}

type SearchParamsData = z.infer<typeof employeeManagementSchema>

const EmployeeManagementPage = async ({
  searchParams,
}: EmployeeManagementPageProps) => {
  await auth().protect(EFeature.EMPLOYEE_MANAGEMENT)

  const t = await getTranslations("UserManagement")

  const defaultParams = {
    ...searchParams,
    isDeleted: searchParams.isDeleted ?? "false",
  }

  // Parse searchParams với schema
  const searchParamsData: SearchParamsData =
    employeeManagementSchema.parse(defaultParams)

  // Create query string from searchParamsData
  const query = new URLSearchParams(
    Object.entries(searchParamsData).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => acc.append(key, String(item)))
      } else {
        acc.append(key, String(value))
      }
      return acc
    }, new URLSearchParams())
  ).toString()

  const tableData = await getEmployees(`${query}`)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("employeeManagement")}</h3>
        <div className="flex items-center gap-x-4">
          <EmployeeExport />
          <EmployeeDialogImport />
          <EmployeeDialogForm mode="create" />
        </div>
      </div>
      <EmployeeContainer tableData={tableData} />
    </div>
  )
}

export default EmployeeManagementPage
