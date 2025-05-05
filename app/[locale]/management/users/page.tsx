import defaultAvatar from "@/public/assets/images/default-avatar.jpg"
import { auth } from "@/queries/auth"
import getUserRoles from "@/queries/users/get-user-roles"
import getUsers from "@/queries/users/get-users"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature, EGender } from "@/lib/types/enums"
import { formatDate } from "@/lib/utils"
import { searchUsersSchema } from "@/lib/validations/user/search-user"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import NoResult from "@/components/ui/no-result"
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
import UserImportDialog from "./_components/user-import-dialog"
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
    <>
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
              <FilterUsersDialog />
            </div>

            <SelectedUserIdsIndicator />
          </div>
          <div className="flex flex-wrap items-center gap-x-4">
            <UserExport />
            <UserImportDialog />
            <MutateUserDialog type="create" />
          </div>
        </div>

        <div className="mt-4 rounded-md border p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {" "}
            <UserHeaderTab />
            <div className="flex flex-wrap items-center gap-4">
              <UserRangeControl />
            </div>
          </div>

          {usersData?.sources.length === 0 ? (
            <div className="flex justify-center p-4">
              <NoResult
                title={t("Patrons Not Found")}
                description={t(
                  "No patrons matching your request were found Please check your information or try searching with different criteria"
                )}
              />
            </div>
          ) : (
            <div className="mt-4 grid w-full">
              <div className="overflow-x-auto rounded-md">
                <Table className="overflow-hidden">
                  <TableHeader>
                    <TableRow>
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
                          <div className="flex min-w-[240px] items-center">
                            <ImageWithFallback
                              src={user.avatar || defaultAvatar}
                              alt={`${user.lastName} ${user.firstName}`}
                              width={36}
                              height={36}
                              fallbackSrc={defaultAvatar}
                              className="mr-2 aspect-square size-9 shrink-0 rounded-full border object-cover object-center"
                            />
                            <p className="truncate" title={user.email}>
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex">{user.firstName}</div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {user.lastName}
                        </TableCell>
                        <TableCell>{user.userCode}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {user?.dob && formatDate(user?.dob)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center text-nowrap">
                            {user.gender === EGender.MALE && <Icons.Male />}
                            {user.gender === EGender.FEMALE && <Icons.Female />}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {user.address}
                        </TableCell>

                        <TableCell className="text-nowrap">
                          {locale === "en"
                            ? user.role.englishName
                            : user.role.vietnameseName}
                        </TableCell>

                        <TableCell>
                          {user.isActive ? (
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
                          <UserActionDropdown
                            user={user}
                            userRoles={userRoles}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>{" "}
              </div>
            </div>
          )}
        </div>

        {usersData?.sources.length > 0 && (
          <Paginator
            pageSize={+pageSize}
            pageIndex={pageIndex}
            totalActualItem={usersData.totalActualItem}
            totalPage={usersData.totalPage}
            className="mt-6"
          />
        )}
      </div>
    </>
  )
}

export default UsersManagementPage
