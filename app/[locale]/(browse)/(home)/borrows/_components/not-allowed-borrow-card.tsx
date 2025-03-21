import { type LibraryItem } from "@/lib/types/models"

type Props = {
  libraryItem: LibraryItem
}

const NotAllowBorrowCard = ({ libraryItem }: Props) => {
  return <div>❌ {libraryItem?.title}</div>
}

export default NotAllowBorrowCard
