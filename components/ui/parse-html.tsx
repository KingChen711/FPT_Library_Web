import parse from "html-react-parser"

import { cn } from "@/lib/utils"

type Props = {
  data: string
  className?: string
}

function ParseHtml({ data, className }: Props) {
  return (
    <div
      className={cn("markdown w-full min-w-full text-foreground", className)}
    >
      {parse(data)}
    </div>
  )
}

export default ParseHtml
