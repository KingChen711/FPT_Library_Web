import UserDialog from "./_components/user-dialog"
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
        <UserDialog />
      </div>
      <UserTable />
    </div>
  )
}

export default UserManagementPage
