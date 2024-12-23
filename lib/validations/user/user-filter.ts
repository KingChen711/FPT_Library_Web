import { z } from "zod"

export enum UserFilter {
  USER_CODE = "userCode",
  ROLE_ID = "roleId",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  IS_ACTIVE = "isActive",
  GENDER = "gender",
  DOB_RANGE = "dobRange",
  CREATE_DATE_RANGE = "createDateRange",
  MODIFIED_DATE_RANGE = "modifiedDateRange",
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

export const usersFilterSchema = z.object({
  [UserFilter.USER_CODE]: z.string().trim().optional(),
  [UserFilter.ROLE_ID]: z.string().trim().optional(),

  [UserFilter.FIRST_NAME]: z.string().trim().optional(),
  [UserFilter.LAST_NAME]: z.string().trim().optional(),
  [UserFilter.GENDER]: z.enum(["Male", "Female"]).optional(),
  [UserFilter.IS_ACTIVE]: z.string().trim().optional(),

  [UserFilter.DOB_RANGE]: z.array(z.string().trim()).optional(),
  [UserFilter.CREATE_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [UserFilter.MODIFIED_DATE_RANGE]: z.array(z.string().trim()).optional(),
  [UserFilter.HIRE_DATE_RANGE]: z.array(z.string().trim()).optional(),

  [UserFilter.PAGE_INDEX]: z.number().optional(),
  [UserFilter.PAGE_SIZE]: z.number().optional(),
  [UserFilter.SEARCH]: z.string().trim().optional(),

  [UserFilter.EMAIL]: z.string().trim().optional(),
})

export type TUsersFilterSchema = z.infer<typeof usersFilterSchema>
