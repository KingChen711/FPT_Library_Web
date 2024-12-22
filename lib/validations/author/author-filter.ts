import { z } from "zod"

export enum AuthorFilter {
  AUTHOR_CODE = "authorCode",
  AUTHOR_IMAGE = "authorImage",
  FULL_NAME = "fullName",
  BIOGRAPHY = "biography",
  DOB = "dob",
  DATE_OF_DEATH = "dateOfDeath",
  NATIONALITY = "nationality",
  CREATE_DATE = "createDate",
  UPDATE_DATE = "updateDate",
  IS_DELETED = "isDeleted",

  // Enum for sorting
  CREATE_DATE_RANGE = "createDateRange",
  UPDATE_DATE_RANGE = "updateDateRange",

  PAGE_INDEX = "pageIndex",
  PAGE_SIZE = "pageSize",
  SEARCH = "search",
}

export const employeesFilterSchema = z.object({
  [AuthorFilter.AUTHOR_CODE]: z.string().trim().optional(),

  [AuthorFilter.FULL_NAME]: z.string().trim().optional(),
  [AuthorFilter.BIOGRAPHY]: z.string().trim().optional(),
  [AuthorFilter.NATIONALITY]: z.string().trim().optional(),

  [AuthorFilter.DOB]: z.string().trim().optional(),
  [AuthorFilter.DATE_OF_DEATH]: z.string().trim().optional(),

  [AuthorFilter.UPDATE_DATE_RANGE]: z.array(z.string().trim()).optional(),

  // [AuthorFilter.DOB_RANGE]: z.array(z.string().trim()).optional(),
  [AuthorFilter.CREATE_DATE_RANGE]: z.array(z.string().trim()).optional(),

  [AuthorFilter.PAGE_INDEX]: z.number().optional(),
  [AuthorFilter.PAGE_SIZE]: z.number().optional(),
  [AuthorFilter.SEARCH]: z.string().trim().optional(),
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>
