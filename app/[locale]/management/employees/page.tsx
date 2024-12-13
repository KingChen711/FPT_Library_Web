import { Suspense } from "react"
import { getEmployees } from "@/queries/employees/get-employees"
import { FileUp } from "lucide-react"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

import EmployeeDialogForm from "./_components/employee-dialog-form"
import EmployeeDialogImport from "./_components/employee-dialog-import"
import EmployeeSearch from "./_components/employee-search"
import EmployeeTable from "./_components/employee-table"

enum EmployeeGender {
  Male = "Male",
  Female = "Female",
}

const employeeManagementSchema = z.object({
  employeeCode: z.string().catch(""),
  roleId: z.string().catch(""),
  gender: z.nativeEnum(EmployeeGender).optional().default(EmployeeGender.Male),
  isActive: z.boolean().catch(true),
  pageIndex: z.coerce.number().catch(1), // Coerce strings to numbers
  pageSize: z.coerce.number().catch(5), // Coerce strings to numbers
  search: z.string().catch(""),
  sort: z.string().catch(""),
  dobRange: z.array(z.string()).catch([]),
  createDateRange: z.array(z.string()).catch([]),
  modifiedDateRange: z.array(z.string()).catch([]),
  hireDateRange: z.array(z.string()).catch([]),
})

type EmployeeManagementPageProps = {
  searchParams: Partial<z.infer<typeof employeeManagementSchema>>
}

type SearchParamsData = z.infer<typeof employeeManagementSchema>

const EmployeeManagementPage = async ({
  searchParams,
}: EmployeeManagementPageProps) => {
  const t = await getTranslations("UserManagement")

  const searchParamsData: SearchParamsData =
    employeeManagementSchema.parse(searchParams)

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

  const tableData = await getEmployees(query)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold">{t("employeeManagement")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-primary-foreground">
            <FileUp size={16} /> {t("export")}
          </Button>
          <EmployeeDialogImport />
          <EmployeeDialogForm mode="create" />
        </div>
      </div>
      <div className="w-full rounded-lg bg-primary-foreground p-4">
        <div>
          <EmployeeSearch />
          <div className="rounded-md border">
            <Suspense fallback={<div>Loading...</div>}>
              <EmployeeTable tableData={tableData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManagementPage
