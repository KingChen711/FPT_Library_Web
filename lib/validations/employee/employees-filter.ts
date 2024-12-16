import { z } from "zod"

export enum EmployeeFilter {
  EMPLOYEE_CODE = "employeeCode",
  ROLE_ID = "roleId",
  IS_ACTIVE = "isActive",
  GENDER = "gender",
  DOB_RANGE = "dobRange",
  CREATE_DATE_RANGE = "createDateRange",
  MODIFIED_DATE_RANGE = "modifieldDateRange",
  HIRE_DATE_RANGE = "hireDateRange",
  PAGE_INDEX = "pageIndex",
  PAGE_SIZE = "pageSize",
  SEARCH = "search",
}

export const employeesFilterSchema = z.object({
  [EmployeeFilter.EMPLOYEE_CODE]: z.string().trim().optional(), // Done maybe
  [EmployeeFilter.ROLE_ID]: z.string().trim().optional(), // Done
  [EmployeeFilter.GENDER]: z.enum(["Male", "Female"]).optional(), // Done
  [EmployeeFilter.IS_ACTIVE]: z.string().trim().optional(), // Done

  [EmployeeFilter.DOB_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.CREATE_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.MODIFIED_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.HIRE_DATE_RANGE]: z.array(z.string().trim()).optional(),

  [EmployeeFilter.PAGE_INDEX]: z.number().optional(), // Done
  [EmployeeFilter.PAGE_SIZE]: z.number().optional(), // Done
  [EmployeeFilter.SEARCH]: z.string().trim().optional(), // Done
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>
