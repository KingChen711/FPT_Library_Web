import React from "react"
import getUserPermissions from "@/queries/roles/get-user-permissions"
import { Plus } from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AccessLevelDropdown from "./_components/access-level-dropdown"

const rolesManagementSchema = z.object({
  isRoleVerticalLayout: z.enum(["true", "false"]).catch("false"),
})

type Props = {
  searchParams: {
    isRoleVerticalLayout: string
  }
}

async function RolesManagementPage({ searchParams }: Props) {
  const { isRoleVerticalLayout } = rolesManagementSchema.parse(searchParams)

  const tableData = await getUserPermissions(Boolean(isRoleVerticalLayout))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">Roles</h3>
        <div className="flex items-center gap-x-4">
          {/* <Button
            variant="outline"
            onClick={() => setUpdateMode((prev) => !prev)}
          >
            {updateMode ? "Cancel" : "Update permissions"}
          </Button> */}
          <Button className="flex items-center justify-end gap-x-1 leading-none">
            <Plus />
            <div>Create role</div>
          </Button>
        </div>
      </div>
      <div className="my-4 grid w-full">
        <div className="relative overflow-x-auto">
          {/* {isPending ? (
            <Table className="mb-2 border-collapse">
              <TableHeader className="rounded-t-xl bg-primary">
                <TableRow>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-6 w-28"></Skeleton>
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody className="rounded-b-xl bg-card">
                <TableRowsSkeleton pageSize={7} colSpan={10} />
              </TableBody>
            </Table>
          ) : ( */}
          <Table className="mb-2 border-collapse">
            <TableHeader className="rounded-t-xl bg-primary">
              <TableRow>
                {tableData?.columnHeaders.map((headerContent, i) => (
                  <TableHead
                    key={headerContent}
                    className={cn(i === 0 && "sticky left-0 bg-primary")}
                  >
                    <div
                      className={cn(
                        "text-nowrap pl-4 font-bold text-primary-foreground",
                        i === 0 && "pl-1"
                      )}
                    >
                      {headerContent}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-b-xl bg-card">
              {tableData?.dataRows.map((row) => (
                <TableRow key={row.cells[1].rowId}>
                  {row.cells.map((cell) => (
                    <TableCell
                      key={cell.colId}
                      className={cn(
                        "z-0 w-[200xp] text-nowrap font-medium",
                        (!cell.colId || !cell.rowId) &&
                          "sticky left-0 z-[1000] bg-card"
                      )}
                    >
                      {cell.colId && cell.rowId ? (
                        <AccessLevelDropdown
                          // disabled={!updateMode}
                          initPermissionId={cell.permissionId}
                        />
                      ) : (
                        <div className="text-nowrap pl-1 font-bold">
                          {cell.cellContent}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* )} */}
        </div>
      </div>
    </div>
  )
}

export default RolesManagementPage
