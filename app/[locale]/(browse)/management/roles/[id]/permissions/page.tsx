import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AccessLevelDropdown from "./_components/access-level-dropdown"

type Props = {
  params: {
    id: string
  }
}

function PermissionsPage({ params: { id } }: Props) {
  console.log(id)

  return (
    <div>
      <h3 className="text-2xl font-semibold">Admin permissions</h3>
      <div className="my-4 grid w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Role name</TableHead>
                <TableHead className="text-right">Access level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>User Management</TableCell>
                <TableCell className="flex justify-end">
                  <AccessLevelDropdown />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Employee management</TableCell>
                <TableCell className="flex justify-end">
                  <AccessLevelDropdown />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* <div className="mt-6 flex justify-end gap-x-4">
        <Button className="w-24">Save</Button>
        <Button variant="outline" className="w-24">
          Back
        </Button>
      </div> */}
    </div>
  )
}

export default PermissionsPage
