"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import BarcodeCardImg from "@/public/assets/images/barcode-card.png"
import ScannerImg from "@/public/assets/images/scanner.png"
import { motion } from "framer-motion"
import { ChevronLeftCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const MachineReturnPage = () => {
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
      <div className="absolute left-1/2 top-[120px] z-10 -translate-y-1/2 translate-x-2/3">
        <div className="relative">
          <Image
            alt="scanner"
            src={ScannerImg}
            width={240}
            height={240}
            color="green"
            className="-rotate-45"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-md bg-background">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <motion.div
            animate={{ y: isAnimating ? -20 : 20 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Image
              alt="scanner"
              src={BarcodeCardImg}
              width={240}
              height={240}
            />
          </motion.div>
          <p className="mt-4 text-2xl">
            Bạn hãy quét thẻ thành viên để trả sách
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        {/* <MachineLogoutBtn /> */}
        <div className="flex justify-end gap-2">
          <Button onClick={() => router.push("/machine")}>
            <ChevronLeftCircle /> Thoát
          </Button>
          <Button onClick={() => router.push("/machine/return/preview")}>
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MachineReturnPage
