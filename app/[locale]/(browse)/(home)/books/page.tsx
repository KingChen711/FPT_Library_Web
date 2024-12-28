import Image from "next/image"
import { CheckCircle2, CircleX, Heart, MapPin } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Paginator from "@/components/ui/paginator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
    [key: string]: string | string[] | undefined
  }
}

const BookPage = async ({ searchParams }: Props) => {
  const { pageIndex, pageSize, search, sort } = searchParams
  const t = await getTranslations("BookPage")
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px] bg-primary-foreground">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-primary-foreground capitalize">
          <SelectItem value="engineering">{t("engineering")}</SelectItem>
          <SelectItem value="art-science">{t("art-science")}</SelectItem>
          <SelectItem value="architecture">{t("architecture")}</SelectItem>
          <SelectItem value="law">{t("law")}</SelectItem>
        </SelectContent>
      </Select>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md">
          <Table className="border-separate border-spacing-x-0 border-spacing-y-4 overflow-hidden">
            <TableHeader className="">
              <TableRow className="border-none">
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.title")}
                  sortKey="title"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.ratings")}
                  sortKey="ratings"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.category")}
                  sortKey="category"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.availability")}
                  sortKey="availability"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.status")}
                  sortKey="status"
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((item, index) => (
                <TableRow
                  key={index}
                  className="mt-4 overflow-hidden rounded-lg border-2 bg-primary-foreground px-8 shadow-md"
                >
                  <TableCell className="flex items-center gap-2">
                    <div className="flex gap-4 pl-2">
                      <Image
                        src="https://upload.wikimedia.org/wikibooks/vi/a/a6/B%C3%ACa_s%C3%A1ch_Harry_Potter_ph%E1%BA%A7n_6.jpg"
                        priority
                        alt="Logo"
                        width={50}
                        height={60}
                        className="object-cover duration-150 ease-in-out hover:scale-105"
                      />
                      <div className="flex flex-col justify-center gap-2">
                        <Label className="text-xl font-semibold text-primary">
                          Harry Potter
                        </Label>
                        <p className="italic">J.K. Rowling, 2005</p>
                        <p className="font-semibold">Second Edition</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-primary">
                      ⭐ 4.5 / <span className="text-accent-foreground">5</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <p className="text-accent-foreground">Fiction</p>
                      <p className="text-sm">Best seller</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 color="white" fill="#42bb4e" /> Hard copy
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 color="white" fill="#42bb4e" /> E-book
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleX color="white" fill="#868d87" /> Audio book
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {index % 2 === 0 ? (
                        <Badge className="h-full w-fit bg-success hover:bg-success">
                          Available
                        </Badge>
                      ) : (
                        <Badge className="h-full w-fit bg-danger hover:bg-danger">
                          Borrowed
                        </Badge>
                      )}

                      <div className="flex items-center">
                        <MapPin color="white" fill="#F76B56" /> CS A-15
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {index % 2 === 0 ? (
                      <Heart fill="red" color="red" />
                    ) : (
                      <Heart color="gray" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      className="border-danger bg-primary-foreground text-danger"
                    >
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Paginator
          pageSize={5}
          pageIndex={1}
          totalActualItem={100}
          totalPage={12}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default BookPage
