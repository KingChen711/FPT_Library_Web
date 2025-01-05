import Image from "next/image"
import { auth } from "@/queries/auth"
import getUserRoles from "@/queries/users/get-user-roles"
import getUsers from "@/queries/users/get-users"
import { User } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatDate } from "@/lib/utils"
import { searchUsersSchema } from "@/lib/validations/user/search-user"
import { Badge } from "@/components/ui/badge"
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

import FilterUsersDialog from "./_components/filter-user-dialog"
import MutateUserDialog from "./_components/mutate-user-dialog"
import SelectedUserIdsIndicator from "./_components/selected-user-ids-indicator"
import UserActionDropdown from "./_components/user-action-dropdown"
import UserCheckbox from "./_components/user-checkbox"
import UserExport from "./_components/user-export"
import UserHeaderTab from "./_components/user-header-tab"
import UserRangeControl from "./_components/user-range-control"

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

async function UsersManagementPage({ searchParams }: Props) {
  const {
    search,
    pageIndex,
    sort,
    pageSize,
    isDeleted = "false",
    ...rest
  } = searchUsersSchema.parse(searchParams)
  await auth().protect(EFeature.USER_MANAGEMENT)
  const locale = await getLocale()
  const t = await getTranslations("GeneralManagement")

  const [usersData, userRoles] = await Promise.all([
    getUsers({
      search,
      pageIndex,
      sort,
      pageSize,
      isDeleted,
      ...rest,
    }),
    getUserRoles(),
  ])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("user management")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FilterUsersDialog userRoles={userRoles} />
          </div>

          <SelectedUserIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <UserExport />
          {/* <UserImportDialog /> */}
          <MutateUserDialog type="create" userRoles={userRoles} />
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <div className="flex items-center justify-between p-4 pl-0">
            <UserHeaderTab />
            <UserRangeControl />
          </div>
          <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <TableHead></TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label="Email"
                  sortKey="email"
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
                  label={t("fields.userCode")}
                  sortKey="userCode"
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
              {usersData?.sources?.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <UserCheckbox id={user.userId} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 pr-8">
                      <Image
                        src={user.avatar || "https://github.com/shadcn.png"}
                        alt="avatar"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <p>{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.userCode}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user?.dob && formatDate(user?.dob)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center text-nowrap">
                      {user.gender === "Male" ? (
                        <User color="blue" />
                      ) : (
                        <User color="red" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">{user.address}</TableCell>

                  <TableCell>
                    {locale === "en"
                      ? user.role.englishName
                      : user.role.vietnameseName}
                  </TableCell>

                  <TableCell>
                    {user.isActive ? (
                      <Badge className="h-full bg-success hover:bg-success">
                        {t("fields.active")}
                      </Badge>
                    ) : (
                      <Badge variant="default" className="h-full">
                        {t("fields.inactive")}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <UserActionDropdown user={user} userRoles={userRoles} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalActualItem={usersData.totalActualItem}
          totalPage={usersData.totalPage}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default UsersManagementPage
