import { useLocale } from "next-intl"

import { type Package } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PackageCardProps {
  package: Package
  className?: string
  onClick?: () => void
}

export default function PackageCard({
  package: _package,
  className,
  onClick,
}: PackageCardProps) {
  // Format price to Vietnamese currency
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(_package.price)

  const locale = useLocale()

  return (
    <Card
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "w-full max-w-sm border-2 transition-all hover:border-primary/50",
        onClick && "cursor-pointer",
        className
      )}
    >
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-xl font-bold">
            {_package.packageName}
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-nowrap bg-primary/10 text-primary"
          >
            {_package.durationInMonths} {locale === "vi" ? "tháng" : "months"}
          </Badge>
        </div>
        <CardDescription className="text-2xl font-bold text-primary">
          {formattedPrice}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {_package.description && (
          <p className="text-sm text-muted-foreground">
            {_package.description}
          </p>
        )}
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full">Đăng ký ngay</Button>
      </CardFooter> */}
    </Card>
  )
}
