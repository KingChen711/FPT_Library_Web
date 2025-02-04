import { usePathname } from "next/navigation"
import { managementRoutes } from "@/constants"
import { Link } from "@/i18n/routing"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { EFeature } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import useAccessibleFeatures from "@/hooks/features/use-accessible-features"
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

import { Skeleton } from "../ui/skeleton"

const ManagementSidebarContent = () => {
  const t = useTranslations("Routes")
  const pathname = usePathname()
  const { data, isLoading } = useAccessibleFeatures()
  const accessibleFeatures = data?.map((item) => item.featureId) || []

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("Navigator Bar")}</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <>
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </>
        )}
        {!isLoading &&
          managementRoutes.map((route) => {
            if (
              route.feature &&
              !accessibleFeatures.includes(route.feature) &&
              route.feature !== EFeature.DASHBOARD_MANAGEMENT
            ) {
              return null
            }

            const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0

            const isActive = hasSubRoutes
              ? route.subRoutes.some(
                  (subRoute) =>
                    (pathname.slice(3).startsWith(subRoute.route) &&
                      subRoute.route !== "/management") ||
                    (pathname.slice(3) === "/management" &&
                      subRoute.route === "/management")
                )
              : (pathname.slice(3).startsWith(route.route!) &&
                  route.route !== "/management") ||
                (pathname.slice(3) === "/management" &&
                  route.route === "/management")

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
                      <SidebarMenuButton tooltip={route.label}>
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
                        </span>

                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {route.subRoutes.map((subRoute) => {
                          const isActive =
                            (pathname.slice(3).startsWith(subRoute.route) &&
                              route.route !== "/management") ||
                            (pathname.slice(3) === "/management" &&
                              route.route === "/management")
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
                    <Link href={hasSubRoutes ? "#" : route.route!}>
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

export default ManagementSidebarContent
