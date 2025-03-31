import Image from "next/image"
import Link from "next/link"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"Intelligent Library System"}>
        <Link href="/">
          <Image src="/images/logo.png" alt="logo" width={28} height={28} />
          <div className="flex flex-col text-primary">
            <span className="text-sm font-semibold">E-Library System</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
