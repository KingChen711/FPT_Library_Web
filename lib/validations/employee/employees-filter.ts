import { z } from "zod"

export enum EmployeeFilter {
  EMPLOYEE_CODE = "employeeCode",
  ROLE_ID = "roleId",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  IS_ACTIVE = "isActive",
  GENDER = "gender",
  DOB_RANGE = "dobRange",
  CREATE_DATE_RANGE = "createDateRange",
  MODIFIED_DATE_RANGE = "modifieldDateRange",
  HIRE_DATE_RANGE = "hireDateRange",
  PAGE_INDEX = "pageIndex",
  PAGE_SIZE = "pageSize",
  SEARCH = "search",
  EMAIL = "email",

  // Enum for sorting
  ROLE = "role",
  DOB = "dob",
  PHONE = "phone",
  CREATE_DATE = "createDate",
  ADDRESS = "address",
  TERMINATION_DATE = "terminationDate",
  HIRE_DATE = "hireDate",
  ACTIVE = "active",
}

export const employeesFilterSchema = z.object({
  [EmployeeFilter.EMPLOYEE_CODE]: z.string().trim().optional(),
  [EmployeeFilter.ROLE_ID]: z.string().trim().optional(),

  [EmployeeFilter.FIRST_NAME]: z.string().trim().optional(),
  [EmployeeFilter.LAST_NAME]: z.string().trim().optional(),
  [EmployeeFilter.GENDER]: z.enum(["Male", "Female"]).optional(),
  [EmployeeFilter.IS_ACTIVE]: z.string().trim().optional(),

  [EmployeeFilter.DOB_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.CREATE_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.MODIFIED_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [EmployeeFilter.HIRE_DATE_RANGE]: z.array(z.string().trim()).optional(),

  [EmployeeFilter.PAGE_INDEX]: z.number().optional(),
  [EmployeeFilter.PAGE_SIZE]: z.number().optional(),
  [EmployeeFilter.SEARCH]: z.string().trim().optional(),

  [EmployeeFilter.EMAIL]: z.string().trim().optional(),
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>
