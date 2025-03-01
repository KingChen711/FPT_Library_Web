import React from "react"
import Image from "next/image"
import Logo from "@/public/images/logo.png"
import { School } from "lucide-react"

const MachineHeader = () => {
  return (
    <div className="flex h-1/6 items-center justify-between gap-4 rounded-lg bg-primary/90 p-4 text-xl text-primary-foreground shadow-lg">
      <div>
        <Image src={Logo} alt="logo" width={200} height={200} />
      </div>
      <div className="flex-1 text-center text-2xl font-semibold">
        ELibrary _ Intelligent Library System
      </div>
      <div className="flex items-center gap-2">
        <School size={100} />
      </div>
    </div>
  )
}

export default MachineHeader
