import Image from "next/image"
import { auth } from "@/queries/auth"
import { getAuthors } from "@/queries/authors/get-authors"
import { format } from "date-fns"
import { ImageIcon } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatDate, isImageLinkValid } from "@/lib/utils"
import { searchAuthorsSchema } from "@/lib/validations/author/search-author"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AuthorActionDropdown from "./_components/author-action-dropdown"
import AuthorBioDialog from "./_components/author-bio-dialog"
import AuthorCheckbox from "./_components/author-checkbox"
import AuthorExport from "./_components/author-export"
import AuthorHeaderTab from "./_components/author-header-tab"
import AuthorImportDialog from "./_components/author-import-dialog"
import AuthorRangeControl from "./_components/author-range-control"
import FiltersAuthorsDialog from "./_components/filter-author-dialog"
import MutateAuthorDialog from "./_components/mutate-author-dialog"
import SelectedAuthorIdsIndicator from "./_components/selected-author-ids-indicator"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
    isDeleted?: string
    [key: string]: string | string[] | undefined
  }
}

async function AuthorsManagementPage({ searchParams }: Props) {
  const {
    search,
    pageIndex,
    sort,
    pageSize,
    isDeleted = "false",

    ...rest
  } = searchAuthorsSchema.parse(searchParams)
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("GeneralManagement")

  const authorsData = await getAuthors({
    search,
    pageIndex,
    sort,
    pageSize,
    isDeleted,
    ...rest,
  })
  console.log("🚀 ~ AuthorsManagementPage ~ authorsData:", authorsData)

  if (!authorsData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{t("no authors found")}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("author management")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersAuthorsDialog />
          </div>

          <SelectedAuthorIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <AuthorExport />
          <AuthorImportDialog />
          <MutateAuthorDialog type="create" />
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <div className="flex items-center justify-between p-4 pl-0">
            <AuthorHeaderTab />
            <AuthorRangeControl />
          </div>
          <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <TableHead></TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.fullName")}
                  sortKey="fullName"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.image")}
                  sortKey="image"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.authorCode")}
                  sortKey="authorCode"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.biography")}
                  sortKey="biography"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.dob")}
                  sortKey="dob"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.dateOfDeath")}
                  sortKey="dateOfDeath"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.nationality")}
                  sortKey="nationality"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.createDate")}
                  sortKey="createDate"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.updateDate")}
                  sortKey="updateDate"
                />
                <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                  {t("action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorsData?.sources?.map((author) => (
                <TableRow key={author.authorId}>
                  <TableCell>
                    <AuthorCheckbox id={author.authorId.toString()} />
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {author.fullName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {isImageLinkValid(author.authorImage) ? (
                        <Image
                          src={author.authorImage}
                          alt="avatar"
                          width={30}
                          height={30}
                        />
                      ) : (
                        <ImageIcon size={30} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{author.authorCode}</TableCell>
                  <TableCell className="ml-0 flex items-center pl-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <AuthorBioDialog bio={author.biography} />
                      <div
                        className="line-clamp-1 max-w-[260px] flex-1 text-ellipsis"
                        dangerouslySetInnerHTML={{ __html: author.biography }}
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    {author?.dob ? formatDate(author?.dob) : "_"}
                  </TableCell>

                  <TableCell>
                    {author.dateOfDeath
                      ? format(new Date(author.dateOfDeath), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {author.nationality}
                  </TableCell>
                  <TableCell>
                    {author?.createDate ? formatDate(author?.createDate) : "_"}
                  </TableCell>
                  <TableCell>
                    {author?.updateDate ? formatDate(author?.updateDate) : "_"}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <AuthorActionDropdown author={author} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalActualItem={authorsData.totalActualItem}
          totalPage={authorsData.totalPage}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default AuthorsManagementPage
