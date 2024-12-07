import { FileDown, FileUp } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

import UserDialogForm from "./_components/user-dialog-form"
import UserHeaderTab from "./_components/user-header-tab"
import UserTable from "./_components/user-table"

type UserManagementPageProps = {
  params: {
    locale: string
  }
}

const UserManagementPage = async ({ params }: UserManagementPageProps) => {
  const t = await getTranslations("UserManagement")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold">{t("users")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <FileUp size={16} /> {t("export")}
          </Button>
          <Button>
            <FileDown size={16} /> {t("import")}
          </Button>
          <UserDialogForm mode="create" />
        </div>
      </div>
      <div className="w-full rounded-lg bg-primary-foreground p-4">
        <UserHeaderTab locale={params.locale} />
        <UserTable />
      </div>
    </div>
  )
}

export default UserManagementPage
