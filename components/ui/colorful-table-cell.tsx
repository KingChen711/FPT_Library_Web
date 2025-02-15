import { cn } from "@/lib/utils"

import { TableCell } from "./table"

type Props = {
  number: number
  threshold: number
  classname?: string
  mark: "%" | "$" | ""
}

const ColorfulTableCell = ({
  number,
  threshold,
  classname,
  mark = "",
}: Props) => {
  return (
    <TableCell
      className={cn(
        "border text-center font-semibold",
        { "text-success": number >= threshold },
        { "text-danger": number < threshold },
        classname
      )}
    >
      {number.toFixed(2)}
      {mark}
    </TableCell>
  )
}

export default ColorfulTableCell
