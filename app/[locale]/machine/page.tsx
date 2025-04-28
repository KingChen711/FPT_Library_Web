import { Link } from "@/i18n/routing"
import { ArrowBigDown, ArrowBigUp, RefreshCcw, User } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const MachinePage = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <div className="flex flex-1 items-center gap-16">
        <Card className="flex-1 bg-success">
          <CardContent className="size-[200px] p-4">
            <div className="flex h-full flex-col gap-2 text-primary-foreground">
              <div className="flex flex-1 items-center justify-center">
                <ArrowBigDown className="size-[100px]" />
              </div>
              <Link
                href="/machine/borrow"
                className="text-center text-xl hover:underline"
              >
                Mượn tài liệu
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-success">
          <CardContent className="size-[200px] p-4">
            <div className="flex h-full flex-col gap-2 text-primary-foreground">
              <div className="flex flex-1 items-center justify-center">
                <ArrowBigUp className="size-[100px]" />
              </div>
              <Link
                href="/machine/return"
                className="text-center text-xl hover:underline"
              >
                Trả tài liệu
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-primary/75">
          <CardContent className="size-[200px] p-4">
            <div className="flex h-full flex-col gap-2 text-primary-foreground">
              <div className="flex flex-1 items-center justify-center">
                <User className="size-[100px]" />
              </div>
              <Link
                href="/machine/reader"
                className="text-center text-xl hover:underline"
              >
                Thông tin bạn đọc
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-primary/60">
          <CardContent className="size-[200px] p-4">
            <div className="flex h-full flex-col gap-2 text-primary-foreground">
              <div className="flex flex-1 items-center justify-center">
                <RefreshCcw className="size-[100px]" />
              </div>
              <Link
                href="/machine/extend"
                className="text-center text-xl hover:underline"
              >
                Gia hạn
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MachinePage
