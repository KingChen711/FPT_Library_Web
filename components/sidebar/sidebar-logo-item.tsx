import { School } from "lucide-react"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"Intelligent Library"}>
        <div>
          <School className="size-[18px] shrink-0 text-primary" />
          <div className="flex flex-col text-primary">
            <span className="text-sm font-semibold">Intelligent Library</span>
            <span className="text-xs">HTPV Team</span>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
