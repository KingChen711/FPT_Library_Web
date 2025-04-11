import React from "react"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"

const MachineHomeBtn = () => {
  const router = useRouter()

  return (
    <Button
      variant={"outline"}
      onClick={() => router.push("/machine")}
      className="w-fit"
    >
      <Home /> Về trang chủ
    </Button>
  )
}

export default MachineHomeBtn
