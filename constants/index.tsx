import { Bell, Brain, Map } from "lucide-react"

import { EFeature } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

export const ServerUrl = process.env.NEXT_PUBLIC_API_ENDPOINT

// Pagination Configuration
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 5

// Routes Configuration
export const managementRoutes = [
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
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
    feature: EFeature.BORROW_MANAGEMENT,
    label: "Borrow and Return",
    Icon: (props: { className?: string }) => {
      return <Icons.BorrowReturn {...props} />
    },
    subRoutes: [
      {
        route: "/management/borrows/records",
        label: "Borrow records",
        Icon: (props: { className?: string }) => {
          return <Icons.BorrowBook {...props} />
        },
      },
      {
        route: "/management/borrows/requests",
        label: "Borrow requests",
        Icon: (props: { className?: string }) => {
          return <Icons.BorrowRequest {...props} />
        },
      },
      {
        route: "/management/borrows/reservations",
        label: "Borrow reservations",
        Icon: (props: { className?: string }) => {
          return <Icons.Reservation {...props} />
        },
      },
      {
        route: "/management/borrows/digitals",
        label: "Digital borrows",
        Icon: (props: { className?: string }) => {
          return <Icons.Digital {...props} />
        },
      },
    ],
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
      {
        route: "/management/supplement-requests",
        label: "Supplement requests",
        Icon: (props: { className?: string }) => {
          return (
            <Icons.SupplementRequests
              {...props}
              className={cn("size-4", props?.className)}
            />
          )
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
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/train-sessions",
    label: "Train sessions",
    Icon: (props: { className?: string }) => {
      return <Brain {...props} />
    },
  },
  {
    feature: EFeature.LIBRARY_ITEM_MANAGEMENT,
    route: "/management/shelves",
    label: "Shelves",
    Icon: (props: { className?: string }) => {
      return <Icons.Shelf {...props} />
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
      // {
      //   route: "/management/role-histories",
      //   label: "Role histories",
      //   Icon: (props: { className?: string }) => {
      //     return <HistoryIcon {...props} />
      //   },
      // },
      // {
      //   route: "/management/permission-histories",
      //   label: "Permission histories",
      //   Icon: (props: { className?: string }) => {
      //     return <HistoryIcon {...props} />
      //   },
      // },
    ],
  },
  {
    feature: EFeature.SYSTEM_CONFIGURATION_MANAGEMENT,
    route: "/management/closure-days",
    label: "Closure days",
    Icon: (props: { className?: string }) => {
      return <Icons.Closure {...props} />
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

export const browseRoutes = [
  {
    route: "/",
    label: "Home",
    Icon: (props: { className?: string }) => {
      return <Icons.Home {...props} />
    },
  },
  {
    route: "/policies",
    label: "Policy",
    Icon: (props: { className?: string }) => {
      return <Icons.Fine {...props} />
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
      // {
      //   route: "/ai-recommendation",
      //   label: "AI recommendation",
      //   Icon: (props: { className?: string }) => {
      //     return <Icons.Robot {...props} />
      //   },
      // },
    ],
  },
  {
    feature: EFeature.LOGGED_IN,
    route: "/recommend",
    label: "Recommend for you",
    Icon: (props: { className?: string }) => {
      return <Icons.Recommend {...props} />
    },
  },
  {
    route: "/map",
    label: "Map",
    Icon: (props: { className?: string }) => {
      return <Map {...props} />
    },
  },
  {
    feature: EFeature.LOGGED_IN,
    route: "/me/account/notifications",
    label: "Notifications",
    Icon: (props: { className?: string }) => {
      return <Icons.Bell {...props} />
    },
  },
]

export enum LocalStorageKeys {
  FAVORITE = "favorite",
  OPENING_RECENT = "opening-recent",
  BORROW_LIBRARY_ITEM_IDS = "borrow-library-item-Ids",
  BORROW_RESOURCE_IDS = "borrow-resource-Ids",
}

export const editorPlugin = {
  plugins:
    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker markdown",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
}

export const NOT_CLOUDINARY_URL = "NOT_CLOUDINARY_URL"
