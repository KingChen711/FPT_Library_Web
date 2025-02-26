import Image from "next/image"
import { Link } from "@/i18n/routing"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"Intelligent Library System"}>
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={42} height={42} />
          <div className="flex flex-col text-primary">
            <span className="text-sm font-semibold">E-Library System</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
