import { FileUp } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

import UserDialogForm from "./_components/user-dialog-form"
import UserDialogImport from "./_components/user-dialog-import"
import UserTable from "./_components/user-table"

type UserManagementPageProps = {
  params: {
    locale: string
  }
}

const UserManagementPage = async ({ params }: UserManagementPageProps) => {
  console.log("🚀 ~ UserManagementPage ~ params:", params)
  const t = await getTranslations("UserManagement")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold">{t("users")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-primary-foreground">
            <FileUp size={16} /> {t("export")}
          </Button>
          <UserDialogImport />
          <UserDialogForm mode="create" />
        </div>
      </div>
      <div className="w-full rounded-lg bg-primary-foreground p-4">
        <UserTable />
      </div>
    </div>
  )
}

export default UserManagementPage
