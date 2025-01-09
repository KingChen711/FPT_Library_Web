import { Book } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  bio: string
}

const AuthorBioDialog = ({ bio }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} className="m-0 p-0">
          <Book />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Author bio</DialogTitle>
        </DialogHeader>
        <div dangerouslySetInnerHTML={{ __html: bio }} />
      </DialogContent>
    </Dialog>
  )
}

export default AuthorBioDialog
