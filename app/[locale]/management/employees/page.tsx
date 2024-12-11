import { FileUp } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

import EmployeeDialogForm from "./_components/employee-dialog-form"
import EmployeeDialogImport from "./_components/employee-dialog-import"
import EmployeeTable from "./_components/employee-table"

type EmployeeManagementPageProps = {
  params: {
    locale: string
  }
}

const EmployeeManagementPage = async ({
  params,
}: EmployeeManagementPageProps) => {
  console.log("🚀 ~ params:", params)
  const t = await getTranslations("UserManagement")

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
        <EmployeeTable />
      </div>
    </div>
  )
}

export default EmployeeManagementPage
