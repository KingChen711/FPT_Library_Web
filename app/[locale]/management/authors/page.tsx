import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constants"
import { auth } from "@/queries/auth"
import { getAuthors } from "@/queries/authors/get-authors"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import AuthorContainer from "./_components/author-container"
import AuthorDialogForm from "./_components/author-dialog"
import AuthorDialogImport from "./_components/author-dialog-import"
import AuthorExport from "./_components/author-export"

const searchAuthorSchema = z.object({
  // searchParams
  authorCode: z.string().trim().optional(),
  fullName: z.string().trim().optional(),
  biography: z.string().trim().optional(),
  dob: z.string().trim().optional(),
  dateOfDeath: z.string().trim().optional(),
  nationality: z.string().trim().optional(),

  // Filter
  isDeleted: z.string().trim().optional(),
  dobRange: z.array(z.string().trim()).optional().catch([]),
  dateOfDeathRange: z.array(z.string().trim()).optional().catch([]),
  createDateRange: z.array(z.string().trim()).optional().catch([]),
  modifiedDateRange: z.array(z.string().trim()).optional().catch([]),

  pageIndex: z.coerce.number().catch(DEFAULT_PAGE_INDEX),
  pageSize: z.coerce.number().catch(DEFAULT_PAGE_SIZE),
  search: z.string().trim().optional(),
  sort: z.string().trim().optional(),
})

type AuthorManagementPageProps = {
  searchParams: Partial<z.infer<typeof searchAuthorSchema>>
}

type SearchParamsData = z.infer<typeof searchAuthorSchema>

const AuthorManagementPage = async ({
  searchParams,
}: AuthorManagementPageProps) => {
  // TODO: Check permission
  await auth().protect(EFeature.EMPLOYEE_MANAGEMENT)

  const tGeneralManagement = await getTranslations("GeneralManagement")

  const defaultParams = {
    ...searchParams,
    isDeleted: searchParams.isDeleted ?? "false",
  }

  // Parse searchParams với schema
  const searchParamsData: SearchParamsData =
    searchAuthorSchema.parse(defaultParams)

  // Create query string from searchParamsData
  const query = new URLSearchParams(
    Object.entries(searchParamsData).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => acc.append(key, String(item)))
      } else {
        acc.append(key, String(value))
      }
      return acc
    }, new URLSearchParams())
  ).toString()

  const tableData = await getAuthors(`${query}`)

  console.log("🚀 ~ tableData:", tableData)
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">
          {tGeneralManagement("author management")}
        </h3>
        <div className="flex items-center gap-x-4">
          <AuthorExport />
          <AuthorDialogImport />
          <AuthorDialogForm mode="create" />
        </div>
      </div>
      <AuthorContainer tableData={tableData} />
    </div>
  )
}

export default AuthorManagementPage
