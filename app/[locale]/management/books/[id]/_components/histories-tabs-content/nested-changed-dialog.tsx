/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { EBookCopyStatus } from "@/lib/types/enums"
import { pascalToCamel } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BookCopyStatusBadge from "@/components/ui/book-copy-status-badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface NestedDataDialogProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export function NestedDataDialog({
  isOpen,
  onClose,
  data: d,
}: NestedDataDialogProps) {
  const t = useTranslations("BooksManagementPage")

  if (!d || d.length === 0) return null

  const data = d[0]?.author ? d.map((d: any) => d.author) : d

  const headers = Object.keys(data[0]).filter(
    (key) =>
      ![
        "libraryItemInstanceId",
        "libraryItemId",
        "libraryItemConditionHistories",
        "isDeleted",
        "createdAt",
        "updatedAt",
        "authorId",
        "biography",
        "createDate",
        "updateDate",
        "biography",
      ].includes(key)
  )

  console.log({ headers })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead className="text-nowrap font-bold" key={header}>
                  {t(pascalToCamel(header))}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-explicit-any */}
            {data.map((item: any, index: any) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell className="text-nowrap" key={header}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {header === "status" ? (
                      <BookCopyStatusBadge
                        status={
                          item.isDeleted ? EBookCopyStatus.DELETED : item.status
                        }
                      />
                    ) : header === "dob" || header === "dateOfDeath" ? (
                      <>{format(new Date(item[header]), "dd-MM-yyyy")}</>
                    ) : header === "authorImage" ? (
                      <Avatar className="size-8">
                        <AvatarImage src={item[header] || undefined} />
                        <AvatarFallback>
                          {item.fullName
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <>{item[header]}</>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
