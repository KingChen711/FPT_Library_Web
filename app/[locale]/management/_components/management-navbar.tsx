"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

import Actions from "./actions"

function ManagementNavbar() {
  const { open } = useSidebar()

  return (
    <nav
      className={cn(
        "fixed top-0 z-10 flex h-16 w-full items-center justify-end gap-4 bg-card px-6 shadow transition-all",
        open ? "lg:pl-[279px]" : "lg:pl-[71px]"
      )}
    >
      <Actions />
    </nav>
  )
}

export default ManagementNavbar
