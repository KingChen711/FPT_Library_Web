import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function DeleteRoleDialogContent() {
  const isPending = false

  return (
    <DialogContent className="w-[350px]">
      <DialogHeader>
        <DialogTitle className="mb-4 text-center">
          Are you sure to delete this role?
        </DialogTitle>
        <DialogDescription asChild>
          <div className="flex items-center justify-center gap-x-5">
            <Button
              disabled={isPending}
              className="w-[100px]"
              //   onClick={handleDeleteRole}
            >
              <p>Delete</p>{" "}
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
            <DialogClose asChild>
              <Button
                disabled={isPending}
                className="w-[100px]"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}

export default DeleteRoleDialogContent
