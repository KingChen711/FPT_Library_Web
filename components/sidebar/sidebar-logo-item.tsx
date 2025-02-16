import Image from "next/image"
import { Link } from "@/i18n/routing"
import Logo from "@/public/logo.svg"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"Intelligent Library System"}>
        <Link href="/">
          <Image src={Logo} alt="logo" width={40} height={40} />
          <div className="flex flex-col text-primary">
            <span className="text-sm font-semibold">
              Intelligent Library System
            </span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
