import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import RoleActionDropdown from "./_components/role-actions-dropdown"

function RolesManagementPage() {
  return (
    <div>
      <h3 className="text-2xl font-semibold">Roles</h3>
      <div className="my-4 grid w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Role name</TableHead>
                <TableHead>Role type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Administration</TableCell>
                <TableCell>User</TableCell>
                <TableCell className="flex justify-end">
                  <RoleActionDropdown roleId={"1"} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">2</TableCell>
                <TableCell>HeadLibrarian</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell className="flex justify-end">
                  <RoleActionDropdown roleId={"2"} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default RolesManagementPage
