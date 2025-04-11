import Image from "next/image"
import Link from "next/link"
import logo from "@/public/images/logo.png"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"E-Library System"}>
        <Link href="/" className="flex h-12 items-center">
          <Image
            src={logo}
            alt="logo"
            width={28}
            height={28}
            placeholder="blur"
          />
          <div className="flex flex-col text-primary">
            <span className="text-base font-semibold">E-Library System</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
