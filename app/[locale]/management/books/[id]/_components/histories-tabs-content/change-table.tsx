/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useTranslations } from "next-intl"

import { cn, pascalToCamel } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ChangesTableProps {
  oldValue: object | null
  newValue: object | null
  renderValue: (value: any) => string | React.JSX.Element
}

function flattenObject(obj: any, prefix = "") {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + "." : ""
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }
    return acc
  }, {})
}

export function ChangesTable({
  oldValue,
  newValue,
  renderValue,
}: ChangesTableProps) {
  const t = useTranslations("BooksManagementPage")

  const flatOldValue = flattenObject(oldValue || {})
  const flatNewValue = flattenObject(newValue || {})

  const allKeys = Array.from(
    new Set([...Object.keys(flatOldValue), ...Object.keys(flatNewValue)])
  ).filter(
    (key) =>
      ![
        "categoryId",
        "category.categoryId",
        "shelfId",
        "shelf.sectionId",
        "shelf.isDeleted",
        "groupId",
        "isDeleted",
        "shelf.isDeleted",
        "libraryItemId",
      ].includes(key)
  )

  console.log({ oldValue, newValue })

  return (
    <div className="grid w-full">
      <div className="overflow-x-auto rounded-md">
        <Table className="max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-nowrap font-bold">
                {t("Field")}
              </TableHead>
              <TableHead className="text-nowrap font-bold">
                {t("Old value")}
              </TableHead>
              <TableHead className="text-nowrap font-bold">
                {t("New value")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allKeys.map((key) => {
              const oldValue = JSON.stringify(flatOldValue[key])
              const newValue = JSON.stringify(flatNewValue[key])
              if (oldValue !== newValue) {
                return (
                  <TableRow key={key}>
                    <TableCell>
                      {t(pascalToCamel(key.replace(".", "")))}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-wrap",
                        oldValue !== newValue ? "bg-red-100" : ""
                      )}
                    >
                      <div className="max-w-full text-wrap">
                        {renderValue(flatOldValue[key])}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-wrap",
                        oldValue !== newValue ? "bg-green-100" : ""
                      )}
                    >
                      <div className="max-w-full text-wrap">
                        {renderValue(flatNewValue[key])}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
              return null
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
