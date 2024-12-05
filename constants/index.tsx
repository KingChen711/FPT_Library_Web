import { Icons } from "@/components/ui/icons"

export const managementRoutes = [
  {
    route: "/management",
    label: "Dashboard",
    Icon: (props: { className?: string }) => {
      return <Icons.Dashboard {...props} />
    },
    roles: ["Admin", "Staff"],
  },
  {
    route: "/management/roles",
    label: "Roles",
    Icon: (props: { className?: string }) => {
      return <Icons.Role {...props} />
    },
    roles: ["Admin"],
  },
]
