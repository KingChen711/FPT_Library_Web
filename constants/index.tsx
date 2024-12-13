import { Icons } from "@/components/ui/icons"

export const managementRoutes = [
  {
    route: "/management",
    label: "Dashboard",
    Icon: (props: { className?: string }) => {
      return <Icons.Dashboard {...props} />
    },
  },
  {
    route: "/management/books",
    label: "Books",
    Icon: (props: { className?: string }) => {
      return <Icons.Book {...props} />
    },
  },
  {
    route: "/management/borrows",
    label: "Borrows",
    Icon: (props: { className?: string }) => {
      return <Icons.BorrowBook {...props} />
    },
  },
  {
    route: "/management/transactions",
    label: "Transactions",
    Icon: (props: { className?: string }) => {
      return <Icons.Transaction {...props} />
    },
  },
  {
    route: "/management/fines",
    label: "Fines",
    Icon: (props: { className?: string }) => {
      return <Icons.Fine {...props} />
    },
  },
  {
    route: "/management/users",
    label: "Users",
    Icon: (props: { className?: string }) => {
      return <Icons.Users {...props} />
    },
  },
  {
    route: "/management/employees",
    label: "Employees",
    Icon: (props: { className?: string }) => {
      return <Icons.Employees {...props} />
    },
  },
  {
    route: "/management/roles",
    label: "Roles",
    Icon: (props: { className?: string }) => {
      return <Icons.Role {...props} />
    },
  },
  {
    route: "/management/system-health",
    label: "System Health",
    Icon: (props: { className?: string }) => {
      return <Icons.SystemHealth {...props} />
    },
  },
  {
    route: "/management/system-configuration",
    label: "System Configuration",
    Icon: (props: { className?: string }) => {
      return <Icons.SystemConfiguration {...props} />
    },
  },
]
