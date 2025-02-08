import Image from "next/image"
import Logo from "@/public/logo.svg"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"Intelligent Library System"}>
        <div>
          <Image src={Logo} alt="logo" width={40} height={40} />
          <div className="flex flex-col text-primary">
            <span className="text-sm font-semibold">
              Intelligent Library System
            </span>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
