import Link from "next/link"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteRoleDialogContent from "./delete-role-dialog-content"

type Props = {
  roleId: string
}

function RoleActionDropdown({ roleId }: Props) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={`/management/roles/${roleId}/permissions`}
              className="flex items-center gap-x-2"
            >
              <EyeIcon className="size-4" />
              Permissions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={`/management/roles/${roleId}/edit`}
              className="flex items-center gap-x-2"
            >
              <PencilIcon className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <div className="flex cursor-pointer items-center gap-x-2 rounded-sm px-2 py-[6px] text-sm leading-5 hover:bg-muted">
                <Trash2Icon className="size-4" />
                Delete
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteRoleDialogContent />
    </Dialog>
  )
}

export default RoleActionDropdown
