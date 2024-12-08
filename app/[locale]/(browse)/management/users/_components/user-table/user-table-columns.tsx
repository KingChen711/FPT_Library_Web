import { type ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  SquarePen,
} from "lucide-react"

import { type User } from "@/lib/types/models"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const UserTableColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("lastName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of birth
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="w-full text-center lowercase">
        {new Date(row.getValue("dob")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone number
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="w-full text-center lowercase">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex w-full justify-center text-center capitalize">
        {row.getValue("isActive") ? (
          <Badge className="flex w-4/5 justify-center bg-success text-center hover:bg-success">
            Active
          </Badge>
        ) : (
          <Badge className="flex w-4/5 justify-center text-center">
            Inactive
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="w-full text-center">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original
      console.log("🚀 ~ payment:", payment)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-primary-foreground">
            <DropdownMenuItem className="cursor-pointer">
              <SquarePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Eye /> Activate
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <EyeOff /> Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default UserTableColumns
