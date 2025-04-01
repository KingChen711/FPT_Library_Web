import React from "react"
import { auth } from "@/queries/auth"
import getUserPermissions from "@/queries/roles/get-user-permissions"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AccessLevelContextMenu from "./_components/access-level-context-menu"
import DiagonalTableCell from "./_components/diagonal-table-cell"
import RoleActionContextMenu from "./_components/role-action-context-menu"
import RoleLayoutDropdown from "./_components/role-layout-dropdown"

const rolesManagementSchema = z.object({
  isRoleVerticalLayout: z.enum(["true", "false"]).catch("false"),
})

type Props = {
  searchParams: {
    isRoleVerticalLayout: string
  }
}

async function RolesManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.ROLE_MANAGEMENT)

  const { isRoleVerticalLayout } = rolesManagementSchema.parse(searchParams)

  const t = await getTranslations("RoleManagement")
  const tableData = await getUserPermissions(isRoleVerticalLayout === "true")

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Permissions")}</h3>
        <div className="flex items-center gap-x-4">
          <RoleLayoutDropdown />
        </div>
      </div>
      <div className="my-4 grid w-full">
        <div className="relative overflow-x-auto">
          <Table className="mb-2 border-collapse rounded-md border-y border-r">
            <TableHeader
              className={cn(
                isRoleVerticalLayout === "false"
                  ? "bottom-2 left-2"
                  : "right-2 top-2"
              )}
            >
              <TableRow>
                <DiagonalTableCell />
                {tableData?.columnHeaders.map((headerContent, i) => (
                  <TableHead key={headerContent}>
                    {isRoleVerticalLayout === "false" ? (
                      <RoleActionContextMenu
                        roleId={tableData.dataRows[0].cells[i + 1].colId}
                        roleName={headerContent}
                      />
                    ) : (
                      <div className="text-nowrap pl-4 font-bold text-primary">
                        {headerContent}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl bg-card">
              {tableData?.dataRows.map((row, rowIdx) => (
                <TableRow key={row.cells[1].rowId}>
                  {row.cells.map((cell, colIdx) => (
                    <TableCell
                      key={cell.colId}
                      className={cn(
                        "z-10 w-[200xp] text-nowrap font-medium",
                        (!cell.colId || !cell.rowId) && "sticky left-0 bg-card"
                      )}
                    >
                      {cell.colId && cell.rowId ? (
                        <AccessLevelContextMenu
                          isModifiable={cell.isModifiable}
                          roleName={
                            isRoleVerticalLayout === "true"
                              ? row.cells[0].cellContent
                              : tableData?.columnHeaders[colIdx]
                          }
                          featureName={
                            isRoleVerticalLayout === "true"
                              ? tableData?.columnHeaders[colIdx]
                              : row.cells[0].cellContent
                          }
                          colId={cell.colId}
                          rowId={cell.rowId}
                          isRoleVerticalLayout={isRoleVerticalLayout === "true"}
                          initPermissionId={cell.permissionId}
                        />
                      ) : (
                        <>
                          {isRoleVerticalLayout === "true" ? (
                            <RoleActionContextMenu
                              roleId={
                                tableData?.dataRows[rowIdx].cells[1].rowId
                              }
                              roleName={cell.cellContent}
                            />
                          ) : (
                            <div className="text-nowrap pl-1 font-bold text-primary">
                              {cell.cellContent}
                            </div>
                          )}

                          <div className="absolute inset-0 -z-10 border-x"></div>
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default RolesManagementPage
