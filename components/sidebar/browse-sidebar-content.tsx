import { usePathname } from "next/navigation"
import { browseRoutes } from "@/constants"
import { Link } from "@/i18n/routing"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
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

const BrowseSidebarContent = () => {
  const t = useTranslations("Routes")
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("Navigator Bar")}</SidebarGroupLabel>
      <SidebarMenu>
        {browseRoutes.map((route) => {
          const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0

          const normalizedPath = pathname.slice(3) || "/"

          const isActive = hasSubRoutes
            ? route.subRoutes.some((subRoute) =>
                subRoute.route === "/"
                  ? normalizedPath === "/"
                  : normalizedPath.startsWith(subRoute.route)
              )
            : route.route === "/"
              ? normalizedPath === "/"
              : normalizedPath.startsWith(route.route)

          if (hasSubRoutes) {
            return (
              <Collapsible
                key={route.label}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(route.label)}>
                      {route.Icon && (
                        <route.Icon
                          className={cn(
                            "!text-muted-foreground",
                            isActive && "!text-primary"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "text-muted-foreground",
                          isActive && "font-bold text-primary"
                        )}
                      >
                        {t(route.label)}
                      </span>{" "}
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {route.subRoutes.map((subRoute) => {
                        const isActive =
                          (pathname.slice(3).startsWith(subRoute.route) &&
                            route.route !== "") ||
                          (pathname.slice(3) === "" && route.route === "")
                        return (
                          <SidebarMenuSubItem key={subRoute.label}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={subRoute.route}>
                                {subRoute.Icon && (
                                  <subRoute.Icon
                                    className={cn(
                                      "!text-muted-foreground",
                                      isActive && "!text-primary"
                                    )}
                                  />
                                )}
                                <span
                                  className={cn(
                                    "text-muted-foreground",
                                    isActive && "font-bold text-primary"
                                  )}
                                >
                                  {t(subRoute.label)}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          } else {
            return (
              <SidebarMenuItem key={route.label}>
                <SidebarMenuButton
                  tooltip={route.label}
                  asChild
                  isActive={isActive}
                >
                  <Link href={hasSubRoutes ? "#" : route.route}>
                    {route.Icon && (
                      <route.Icon
                        className={cn(
                          "text-muted-foreground",
                          isActive && "text-primary"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-muted-foreground",
                        isActive && "font-bold text-primary"
                      )}
                    >
                      {t(route.label)}
                    </span>
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

export default BrowseSidebarContent
