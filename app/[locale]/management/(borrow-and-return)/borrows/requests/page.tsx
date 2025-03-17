import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function WarehouseBorrowRequestsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)
  const t = await getTranslations("BorrowRequestsManagementPage")
  console.log(searchParams)

  // const formatLocale = await getFormatLocale()

  // const { search, pageIndex, sort, pageSize, ...rest } =
  //   searchBorrowRequestsSchema.parse(searchParams)

  // const {
  //   sources: borrowRequests,
  //   totalActualItem,
  //   totalPage,
  // } = await getBorrowRequests({
  //   search,
  //   pageIndex,
  //   sort,
  //   pageSize,
  //   ...rest,
  // })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">
          {t("Warehouse borrowRequests")}
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            {/* <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            /> */}
            {/* <FiltersBorrowRequestsDialog /> */}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          {/* <CreateBorrowRequestDialog /> */}
        </div>
      </div>

      {/* <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  currentSort={sort}
                  label={t("Receipt number")}
                  sortKey="ReceiptNumber"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Supplier name")}
                  sortKey="SupplierName"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total item")}
                  sortKey="TotalItem"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total amount")}
                  sortKey="TotalAmount"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("BorrowRequest type")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">{t("Status")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Entry date")}
                  sortKey="EntryDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Expected return date")}
                  sortKey="ExpectedReturnDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Actual return date")}
                  sortKey="ActualReturnDate"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">
                    {t("Transfer location")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">{t("Description")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Create at")}
                  sortKey="CreatedAt"
                />

                <TableHead className="text-nowrap font-bold">
                  {t("Created by")}
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Updated at")}
                  sortKey="UpdatedAt"
                />
                <TableHead className="text-nowrap font-bold">
                  {t("Updated by")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowRequests.map((borrowRequest) => (
                <TableRow key={borrowRequest.borrowRequestId}>
                  <TableCell className="text-nowrap font-bold">
                    {borrowRequest.receiptNumber}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest?.supplier?.supplierName}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {borrowRequest.totalItem || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {borrowRequest.totalAmount
                        ? formatPrice(borrowRequest.totalAmount)
                        : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <BorrowRequestTypeBadge
                      type={borrowRequest.borrowRequestType}
                    />
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <BorrowRequestStatusBadge status={borrowRequest.status} />
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {format(new Date(borrowRequest.entryDate), "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.expectedReturnDate
                      ? format(
                          new Date(borrowRequest.expectedReturnDate),
                          "dd MMM yyyy",
                          { locale: formatLocale }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.actualReturnDate
                      ? format(
                          new Date(borrowRequest.actualReturnDate),
                          "dd MMM yyyy",
                          { locale: formatLocale }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.transferLocation || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.description || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.createdAt
                      ? format(
                          new Date(borrowRequest.createdAt),
                          "dd MMM yyyy",
                          {
                            locale: formatLocale,
                          }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.createdBy || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.updatedAt
                      ? format(
                          new Date(borrowRequest.updatedAt),
                          "dd MMM yyyy",
                          {
                            locale: formatLocale,
                          }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {borrowRequest.updatedBy || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              href={`/management/borrowRequests/${borrowRequest.borrowRequestId}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              {t("View details")}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {borrowRequests.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={totalPage}
          totalActualItem={totalActualItem}
          className="mt-6"
        />
      </div> */}
    </div>
  )
}

export default WarehouseBorrowRequestsManagementPage
