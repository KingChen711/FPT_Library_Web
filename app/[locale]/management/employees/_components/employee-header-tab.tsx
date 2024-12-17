"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"

const EmployeeHeaderTab = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleShowDeleted = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("isDeleted", value)
    } else {
      params.delete("isDeleted")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="flex px-4 pt-4">
      <div
        onClick={() => handleShowDeleted("")}
        className={cn(
          "w-[120px] cursor-pointer text-nowrap border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
          !searchParams.has("isDeleted") && "border-primary text-primary"
        )}
      >
        All
      </div>
      <div
        onClick={() => handleShowDeleted("true")}
        className={cn(
          "w-[120px] cursor-pointer text-nowrap border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
          searchParams.get("isDeleted") === "true" &&
            "border-primary text-primary"
        )}
      >
        Deleted
      </div>
      <div
        onClick={() => handleShowDeleted("false")}
        className={cn(
          "w-[120px] cursor-pointer text-nowrap border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
          searchParams.get("isDeleted") === "false" &&
            "border-primary text-primary"
        )}
      >
        Not-Deleted
      </div>
    </div>
  )
}

export default EmployeeHeaderTab
