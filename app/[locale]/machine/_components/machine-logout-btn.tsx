import React from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

const MachineLogoutBtn = () => {
  return (
    <Button variant={"destructive"} className="flex">
      <LogOut /> Logout
    </Button>
  )
}

export default MachineLogoutBtn
