import { managementRoutes } from "@/constants"
import { Link } from "@/i18n/routing"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const ManagementSidebarContent = () => {
  const t = useTranslations("Routes")

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("Navigator Bar")}</SidebarGroupLabel>
      <SidebarMenu>
        {managementRoutes.map((route) => {
          if (route.subRoutes && route.subRoutes.length > 0) {
            return (
              <Collapsible
                key={route.label}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={route.label}>
                      {route.Icon && <route.Icon />}
                      <span>{t(route.label)}</span>

                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {route.subRoutes.map((subRoute) => (
                        <SidebarMenuSubItem key={subRoute.label}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subRoute.route}>{subRoute.label}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          } else {
            return (
              <SidebarMenuItem key={route.label}>
                <SidebarMenuButton tooltip={route.label} asChild>
                  <Link href={route.route}>
                    {route.Icon && <route.Icon />}
                    <span>{t(route.label)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default ManagementSidebarContent
