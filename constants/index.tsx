import packageJson from "@/package.json"
import { Bell } from "lucide-react"

import { EFeature, ENotificationType } from "@/lib/types/enums"
import { Icons } from "@/components/ui/icons"

// Pagination Configuration
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 5

// PDF Version Configuration
export const pdfjsVersion = packageJson.dependencies["pdfjs-dist"]
export const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjsVersion.slice(1)}/build/pdf.worker.min.js`

// Routes Configuration
export const managementRoutes = [
  {
    feature: EFeature.DASHBOARD_MANAGEMENT,
    route: "/management",
    label: "Dashboard",
    Icon: (props: { className?: string }) => {
      return <Icons.Dashboard {...props} />
    },
  },
  {
    feature: EFeature.BOOK_MANAGEMENT,
    route: "/management/books",
    label: "Books",
    Icon: (props: { className?: string }) => {
      return <Icons.Book {...props} />
    },
  },
  {
    feature: EFeature.BOOK_MANAGEMENT,
    route: "/management/authors",
    label: "Authors",
    Icon: (props: { className?: string }) => {
      return <Icons.Author {...props} />
    },
  },
  {
    feature: EFeature.BOOK_MANAGEMENT,
    route: "/management/categories",
    label: "Categories",
    Icon: (props: { className?: string }) => {
      return <Icons.Category {...props} />
    },
  },
  {
    feature: EFeature.BOOK_MANAGEMENT,
    route: "/management/resources",
    label: "Resources",
    Icon: (props: { className?: string }) => {
      return <Icons.Resource {...props} />
    },
  },
  {
    feature: EFeature.BORROW_MANAGEMENT,
    route: "/management/borrows",
    label: "Borrows",
    Icon: (props: { className?: string }) => {
      return <Icons.BorrowBook {...props} />
    },
  },
  {
    feature: EFeature.BORROW_MANAGEMENT,
    route: "/management/returns",
    label: "Returns",
    Icon: (props: { className?: string }) => {
      return <Icons.Return {...props} />
    },
  },
  {
    feature: EFeature.BORROW_MANAGEMENT,
    route: "/management/notifications",
    label: "Notifications",
    Icon: (props: { className?: string }) => {
      return <Bell {...props} />
    },
  },
  {
    feature: EFeature.TRANSACTION_MANAGEMENT,
    route: "/management/transactions",
    label: "Transactions",
    Icon: (props: { className?: string }) => {
      return <Icons.Transaction {...props} />
    },
  },
  {
    feature: EFeature.FINE_MANAGEMENT,
    route: "/management/fines",
    label: "Fines",
    Icon: (props: { className?: string }) => {
      return <Icons.Fine {...props} />
    },
  },
  {
    feature: EFeature.USER_MANAGEMENT,
    route: "/management/users",
    label: "Users",
    Icon: (props: { className?: string }) => {
      return <Icons.Users {...props} />
    },
  },
  {
    feature: EFeature.EMPLOYEE_MANAGEMENT,
    route: "/management/employees",
    label: "Employees",
    Icon: (props: { className?: string }) => {
      return <Icons.Employees {...props} />
    },
  },
  {
    feature: EFeature.ROLE_MANAGEMENT,
    route: "/management/roles",
    label: "Roles",
    Icon: (props: { className?: string }) => {
      return <Icons.Role {...props} />
    },
  },
  {
    feature: EFeature.SYSTEM_HEALTH_MANAGEMENT,
    route: "/management/system-health",
    label: "System Health",
    Icon: (props: { className?: string }) => {
      return <Icons.SystemHealth {...props} />
    },
  },
  {
    feature: EFeature.SYSTEM_CONFIGURATION_MANAGEMENT,
    route: "/management/system-message",
    label: "System Messages",
    Icon: (props: { className?: string }) => {
      return <Icons.SystemConfiguration {...props} />
    },
  },
  {
    feature: EFeature.SYSTEM_CONFIGURATION_MANAGEMENT,
    route: "/management/system-configuration",
    label: "System Configuration",
    Icon: (props: { className?: string }) => {
      return <Icons.SystemConfiguration {...props} />
    },
  },
] as const

export const browseRoutes = [
  {
    route: "",
    label: "Home",
    Icon: (props: { className?: string }) => {
      return <Icons.Home {...props} />
    },
  },
  {
    route: "/books",
    label: "Books",
    Icon: (props: { className?: string }) => {
      return <Icons.Book {...props} />
    },
  },
  {
    route: "/authors",
    label: "Authors",
    Icon: (props: { className?: string }) => {
      return <Icons.Author {...props} />
    },
  },
  {
    route: "/resources",
    label: "Resources",
    Icon: (props: { className?: string }) => {
      return <Icons.Resource {...props} />
    },
  },
] as const

export const getTypeColor = (type: ENotificationType): string => {
  switch (type) {
    case ENotificationType.EVENT:
      return "bg-success"
    case ENotificationType.NOTICE:
      return "bg-info"
    case ENotificationType.REMINDER:
      return "bg-danger"
    default:
      return "bg-primary"
  }
}
