import Image from "next/image"
import { Link } from "@/i18n/routing"
import logo from "@/public/images/logo.png"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const SidebarLogoItem = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={"E-Library System"}>
        <Link href="/" className="flex h-full items-center pb-2">
          <Image src={logo} alt="logo" width={28} height={28} />
          <div className="flex flex-col gap-1 text-primary">
            <span className="text-base font-semibold leading-none">
              Intelligent Library
            </span>
            <span className="text-xs font-semibold leading-none text-muted-foreground">
              Thư viện thông minh
            </span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarLogoItem
