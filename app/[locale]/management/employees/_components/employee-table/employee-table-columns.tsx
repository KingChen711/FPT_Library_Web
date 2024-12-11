import { type ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  EyeOff,
  MoreHorizontal,
  SquarePen,
  Trash,
  User2,
} from "lucide-react"

import { type User } from "@/lib/types/models"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const EmployeeTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "userId",
    header: () => (
      <div className="flex w-full items-center gap-2 font-semibold">No</div>
    ),
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 lowercase">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{row.getValue("email")}</div>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First name
          <ArrowUpDown size={16} />
        </div>
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
        <div
          className="flex w-full cursor-pointer items-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last name
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("lastName")}</div>
    ),
  },

  {
    accessorKey: "dob",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of birth
          <ArrowUpDown size={16} />
        </div>
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
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone number
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="w-full text-center lowercase">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone number
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="w-full text-center lowercase">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex w-full justify-center text-center capitalize">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => (
      <Badge className="flex w-full justify-center text-center capitalize">
        {row.getValue("role")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => (
      <div className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const payment = row.original
      console.log("🚀 ~ payment:", payment)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 w-full justify-center p-0"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-primary-foreground">
            <DropdownMenuItem className="cursor-pointer">
              <SquarePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User2 /> Change role
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <EyeOff /> De-activate user
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Trash /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default EmployeeTableColumns
