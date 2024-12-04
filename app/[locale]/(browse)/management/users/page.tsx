import { FileDown, FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"

import UserDialog from "./_components/user-dialog"
import UserHeaderTab from "./_components/user-header-tab"
import UserTable from "./_components/user-table"

type UserManagementPageProps = {
  params: {
    locale: string
  }
}

const UserManagementPage = ({ params }: UserManagementPageProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <FileUp className="mr-2" size={16} /> Export
          </Button>
          <Button>
            <FileDown className="mr-2" size={16} /> Import
          </Button>
          <UserDialog />
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
