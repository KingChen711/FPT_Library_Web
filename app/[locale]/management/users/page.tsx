import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constants"
import { auth } from "@/queries/auth"
import { getUsers } from "@/queries/users/get-users"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { EFeature, EGender } from "@/lib/types/enums"

import UserContainer from "./_components/user-container"
import UserDialogForm from "./_components/user-dialog"
import UserDialogImport from "./_components/user-dialog-import"
import UserExport from "./_components/user-export"

const userManagementSchema = z.object({
  employeeCode: z.string().trim().optional(),
  roleId: z.string().trim().optional(),
  gender: z.nativeEnum(EGender).optional(),
  isActive: z.string().trim().optional(),
  pageIndex: z.coerce.number().catch(DEFAULT_PAGE_INDEX),
  pageSize: z.coerce.number().catch(DEFAULT_PAGE_SIZE),
  search: z.string().trim().optional(),
  sort: z.string().trim().optional(),
  isDeleted: z.string().trim().optional(),
  dobRange: z.array(z.string().trim()).optional().catch([]),
  createDateRange: z.array(z.string().trim()).optional().catch([]),
  modifiedDateRange: z.array(z.string().trim()).optional().catch([]),
})

type UserManagementPageProps = {
  searchParams: Partial<z.infer<typeof userManagementSchema>>
}

type SearchParamsData = z.infer<typeof userManagementSchema>

const UserManagementPage = async ({
  searchParams,
}: UserManagementPageProps) => {
  await auth().protect(EFeature.EMPLOYEE_MANAGEMENT)

  const tGeneralManagement = await getTranslations("GeneralManagement")

  const defaultParams = {
    ...searchParams,
    isDeleted: searchParams.isDeleted ?? "false",
  }

  // Parse searchParams với schema
  const searchParamsData: SearchParamsData =
    userManagementSchema.parse(defaultParams)

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

  const tableData = await getUsers(`${query}`)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">
          {tGeneralManagement("user management")}
        </h3>
        <div className="flex items-center gap-x-4">
          <UserExport />
          <UserDialogImport />
          <UserDialogForm mode="create" />
        </div>
      </div>
      <UserContainer tableData={tableData} />
    </div>
  )
}

export default UserManagementPage
