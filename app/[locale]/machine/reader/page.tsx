"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { motion } from "framer-motion"
import { ChevronLeftCircle, IdCard } from "lucide-react"

import { Button } from "@/components/ui/button"

const MachineReaderPage = () => {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex size-full flex-col gap-4">
      {/* Light Animation */}
      <div className="absolute left-1/2 top-[180px] z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 size-20 rounded-full bg-green-500 opacity-50 blur-3xl" />
          <div className="size-12 rounded-full bg-green-400 shadow-[0_0_20px_5px_rgba(34,197,94,0.8)]" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg bg-background">
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            animate={{ y: isAnimating ? -50 : 50 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <IdCard size={400} strokeWidth={1} />
          </motion.div>
          <p className="mt-4 text-2xl">
            Đưa thẻ của bạn vào khu vực đọc phía dưới màn hình
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        {/* <MachineLogoutBtn /> */}
        <div className="flex justify-end gap-2">
          <Button onClick={() => router.push("/machine")}>
            <ChevronLeftCircle /> Thoát
          </Button>
          <Button onClick={() => router.push("/machine/reader/preview")}>
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MachineReaderPage
