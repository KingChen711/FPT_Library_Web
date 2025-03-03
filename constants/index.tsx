import { Bell } from "lucide-react"

import { EFeature, type Route } from "@/lib/types/enums"
import { Icons } from "@/components/ui/icons"

export const ServerUrl = process.env.NEXT_PUBLIC_API_ENDPOINT

// Pagination Configuration
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 5

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
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/books",
    label: "Books",
    Icon: (props: { className?: string }) => {
      return <Icons.Book {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/authors",
    label: "Authors",
    Icon: (props: { className?: string }) => {
      return <Icons.Author {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/categories",
    label: "Categories",
    Icon: (props: { className?: string }) => {
      return <Icons.Category {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/packages",
    label: "Library Packages",
    Icon: (props: { className?: string }) => {
      return <Icons.Package {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/conditions",
    label: "Conditions",
    Icon: (props: { className?: string }) => {
      return <Icons.Condition {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
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
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    label: "Library card",
    Icon: (props: { className?: string }) => {
      return <Icons.LibraryCardManagement {...props} />
    },
    subRoutes: [
      {
        route: "/management/library-card-holders",
        label: "Patrons",
        Icon: (props: { className?: string }) => {
          return <Icons.Holders {...props} />
        },
      },
      {
        route: "/management/library-cards",
        label: "Cards",
        Icon: (props: { className?: string }) => {
          return <Icons.LibraryCard {...props} />
        },
      },
    ],
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
    feature: EFeature.WAREHOUSE_TRACKING_MANAGEMENT,
    label: "Warehouse",
    Icon: (props: { className?: string }) => {
      return <Icons.Warehouse {...props} />
    },
    subRoutes: [
      {
        route: "/management/suppliers",
        label: "Suppliers",
        Icon: (props: { className?: string }) => {
          return <Icons.Supplier {...props} />
        },
      },
      {
        route: "/management/trackings",
        label: "Trackings",
        Icon: (props: { className?: string }) => {
          return <Icons.Tracking {...props} />
        },
      },
    ],
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
    label: "Identity and Access",
    Icon: (props: { className?: string }) => {
      return <Icons.Lock {...props} />
    },
    subRoutes: [
      {
        route: "/management/roles",
        label: "Roles",
        Icon: (props: { className?: string }) => {
          return <Icons.Role {...props} />
        },
      },
      {
        route: "/management/permissions",
        label: "Permissions",
        Icon: (props: { className?: string }) => {
          return <Icons.Key {...props} />
        },
      },
    ],
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
    route: "/search",
    label: "Search",
    Icon: (props: { className?: string }) => {
      return <Icons.Search {...props} />
    },
    subRoutes: [
      {
        route: "/search",
        label: "Search page",
        Icon: (props: { className?: string }) => {
          return <Icons.Search {...props} />
        },
      },
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

export const NOT_CLOUDINARY_URL = "NOT_CLOUDINARY_URL"
