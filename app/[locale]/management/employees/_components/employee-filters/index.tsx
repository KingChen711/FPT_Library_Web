/* eslint-disable @typescript-eslint/unbound-method */
"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FilterIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDebouncedCallback } from "use-debounce"

import { EmployeeFilter } from "@/lib/validations/employee/employees-filter"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EmployeeFilterActive from "./employee-filter-active"
import EmployeeFilterDateRange from "./employee-filter-date-range"
import EmployeeFilterGender from "./employee-filter-gender"
import EmployeeFilterInput from "./employee-filter-input"
import EmployeeFilterRoleId from "./employee-filter-roleId"

const EmployeeFilters = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)

  const handleAddTextSearchParams = useDebouncedCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      replace(`${pathname}?${params.toString()}`)
    },
    300
  )

  const handleClearAllSearchParams = () => {
    const params = new URLSearchParams()
    replace(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const handleDeleteSearchParam = (key: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" onClick={() => setOpen(true)}>
          <FilterIcon /> {tGeneralManagement("btn.filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[400px] min-w-[600px] overflow-y-auto bg-primary-foreground">
        <div className="flex flex-col gap-4">
          <EmployeeFilterInput
            label={tGeneralManagement("fields.employeeCode")}
            placeholder={tGeneralManagement("placeholder.code")}
            enumField={EmployeeFilter.EMPLOYEE_CODE}
            handleAddTextSearchParams={handleAddTextSearchParams}
            handleDeleteSearchParam={handleDeleteSearchParam}
          />

          <EmployeeFilterInput
            label={tGeneralManagement("fields.firstName")}
            placeholder={tGeneralManagement("placeholder.firstName")}
            enumField={EmployeeFilter.FIRST_NAME}
            handleAddTextSearchParams={handleAddTextSearchParams}
            handleDeleteSearchParam={handleDeleteSearchParam}
          />

          <EmployeeFilterInput
            label={tGeneralManagement("fields.lastName")}
            placeholder={tGeneralManagement("placeholder.lastName")}
            enumField={EmployeeFilter.LAST_NAME}
            handleAddTextSearchParams={handleAddTextSearchParams}
            handleDeleteSearchParam={handleDeleteSearchParam}
          />

          <EmployeeFilterRoleId
            handleAddTextSearchParams={handleAddTextSearchParams}
          />
          <EmployeeFilterActive
            handleAddTextSearchParams={handleAddTextSearchParams}
          />
          <EmployeeFilterGender
            handleAddTextSearchParams={handleAddTextSearchParams}
          />

          <EmployeeFilterDateRange
            label={tGeneralManagement("fields.dob")}
            enumField={EmployeeFilter.DOB_RANGE}
          />

          <EmployeeFilterDateRange
            label={tGeneralManagement("fields.createdDate")}
            enumField={EmployeeFilter.CREATE_DATE_RANGE}
          />
          <EmployeeFilterDateRange
            label={tGeneralManagement("fields.updatedDate")}
            enumField={EmployeeFilter.MODIFIED_DATE_RANGE}
          />
          <EmployeeFilterDateRange
            label={tGeneralManagement("fields.hireDate")}
            enumField={EmployeeFilter.HIRE_DATE_RANGE}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant={"outline"}
              onClick={() => handleClearAllSearchParams()}
            >
              {tGeneralManagement("btn.reset")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EmployeeFilters
