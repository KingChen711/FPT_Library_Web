import { Bell } from "lucide-react"

import { EFeature, type Route } from "@/lib/types/enums"
import { Icons } from "@/components/ui/icons"

export const ServerUrl = process.env.NEXT_PUBLIC_API_ENDPOINT

// Pagination Configuration
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 5

// Routes Configuration
export const managementRoutes: Route[] = [
  {
    feature: EFeature.DASHBOARD_MANAGEMENT,
    route: "/management",
    label: "Dashboard",
    Icon: (props: { className?: string }) => {
      return <Icons.Dashboard {...props} />
    },
    subRoutes: [
      {
        route: "",
        label: "Sub Dashboard 1",
        Icon: (props: { className?: string }) => {
          return <Icons.Dashboard {...props} />
        },
      },
      {
        route: "",
        label: "Sub Dashboard 2",
        Icon: (props: { className?: string }) => {
          return <Icons.Dashboard {...props} />
        },
      },
    ],
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
]

export const browseRoutes: Route[] = [
  {
    route: "/",
    label: "Home",
    Icon: (props: { className?: string }) => {
      return <Icons.Home {...props} />
    },
  },
  {
    route: "ai",
    label: "AI",
    Icon: (props: { className?: string }) => {
      return <Icons.Robot {...props} />
    },
    subRoutes: [
      {
        route: "/ai-prediction",
        label: "AI prediction",
        Icon: (props: { className?: string }) => {
          return <Icons.Robot {...props} />
        },
      },
      {
        route: "/ai-recommendation",
        label: "AI recommendation",
        Icon: (props: { className?: string }) => {
          return <Icons.Robot {...props} />
        },
      },
    ],
  },
  {
    route: "/search",
    label: "Search",
    Icon: (props: { className?: string }) => {
      return <Icons.Search {...props} />
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
  {
    route: "/my-shelf",
    label: "My shelf",
    Icon: (props: { className?: string }) => {
      return <Icons.Shelf {...props} />
    },
  },
  {
    route: "/notifications",
    label: "Notifications",
    Icon: (props: { className?: string }) => {
      return <Icons.Bell {...props} />
    },
  },
]

export const editorPlugin = {
  plugins:
    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker markdown",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
}
