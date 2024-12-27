"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"
import { useTranslations } from "next-intl"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"

const EmployeeHeaderTab = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("GeneralManagement")
  const { clear } = useManagementEmployeesStore()

  const handleShowDeleted = useDebouncedCallback((value: string) => {
    clear()
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("isDeleted", value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="flex pt-4">
      <div
        onClick={() => handleShowDeleted("false")}
        className={cn(
          "w-[120px] cursor-pointer text-nowrap border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
          searchParams.get("isDeleted") !== "true" &&
            "border-primary text-primary"
        )}
      >
        {t("all")}
      </div>
      <div
        onClick={() => handleShowDeleted("true")}
        className={cn(
          "w-[120px] cursor-pointer text-nowrap border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
          searchParams.get("isDeleted") === "true" &&
            "border-primary text-primary"
        )}
      >
        {t("trash")}
      </div>
    </div>
  )
}

export default EmployeeHeaderTab
