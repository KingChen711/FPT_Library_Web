"use client"

import { type Dispatch, type SetStateAction } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePathname } from "@/i18n/routing"
import { type TGetUSersData } from "@/queries/users/get-users"
import { ArrowDownUp, User as UserIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type User } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { UserFilter } from "@/lib/validations/user/user-filter"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import UserAction from "./user-action"
import UserPagination from "./user-pagination"
import UserRowPage from "./user-row-page"

type UserTableProps = {
  tableData: TGetUSersData
  selectedIds: string[]
  setSelectedIds: Dispatch<SetStateAction<string[]>>
}

const UserTable = ({
  tableData,
  selectedIds,
  setSelectedIds,
}: UserTableProps) => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("GeneralManagement")
  const searchParams = useSearchParams()

  const handleSortParams = (key: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSort = params.get("sort")

    const newSort =
      currentSort === `-${key}` ? key : currentSort === key ? `-${key}` : key

    params.set("sort", newSort)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const isAllSelected =
    tableData.sources.length > 0 &&
    selectedIds.length === tableData.sources.length

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(tableData.sources.map((user) => user.userId))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    )
  }

  if (tableData.sources.length === 0) {
    return (
      <div className="p-4 text-center text-xl font-semibold text-destructive">
        {t("no data")}
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <Table className="border-collapse rounded-xl border-y border-r">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>No</TableHead>
                <TableHead
                  className="flex items-center gap-x-2 text-nowrap"
                  onClick={() => handleSortParams(UserFilter.EMAIL)}
                >
                  {t("fields.email")}
                  <ArrowDownUp size={16} className="cursor-pointer" />
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(UserFilter.FIRST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.firstName")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(UserFilter.LAST_NAME)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.lastName")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSortParams(UserFilter.USER_CODE)}
                >
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.userCode")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(UserFilter.PHONE)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.phone")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(UserFilter.DOB)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.dob")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(UserFilter.GENDER)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.gender")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(UserFilter.ADDRESS)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.address")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>

                <TableHead onClick={() => handleSortParams(UserFilter.ROLE)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.role")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortParams(UserFilter.ACTIVE)}>
                  <div className="flex items-center gap-x-2 text-nowrap">
                    {t("fields.status")}
                    <ArrowDownUp size={16} className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap"> {t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl">
              {tableData.sources.map((user: User, index: number) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(user.userId)}
                      onCheckedChange={() => toggleRow(user.userId)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
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
                  <TableCell className="text-nowrap">
                    {user.firstName}
                  </TableCell>
                  <TableCell className="text-nowrap">{user.lastName}</TableCell>
                  <TableCell>{user.userCode}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user?.dob && formatDate(user?.dob)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center text-nowrap">
                      {user.gender === "Male" ? (
                        <UserIcon color="blue" />
                      ) : (
                        <UserIcon color="red" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">{user.address}</TableCell>

                  <TableCell className="text-nowrap">
                    {locale === "en"
                      ? user.role.englishName
                      : user.role.vietnameseName}
                  </TableCell>
                  <TableCell className="flex h-full items-center justify-center text-nowrap">
                    {user.isActive ? (
                      <Badge className="h-full bg-success hover:bg-success">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="default" className="h-full">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <UserAction user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-end p-4">
        <div className="flex w-2/3 items-center justify-between">
          <UserPagination totalPages={tableData.totalPage} />
          <UserRowPage />
        </div>
      </div>
    </div>
  )
}

export default UserTable
