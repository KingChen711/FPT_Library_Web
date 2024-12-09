import { Skeleton } from "../ui/skeleton"
import { TableCell, TableRow } from "../ui/table"

type Props = {
  pageSize: number
  colSpan: number
}

function TableRowsSkeleton({ colSpan, pageSize }: Props) {
  return (
    <>
      {Array(pageSize)
        .fill(0)
        .map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={colSpan} className="p-0">
              <Skeleton className="my-2 h-12 w-full" />
            </TableCell>
          </TableRow>
        ))}
    </>
  )
}

export default TableRowsSkeleton
