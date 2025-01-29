import Image from "next/image"
import { Link } from "@/i18n/routing"
import {
  CheckCircle2,
  ChevronRight,
  CircleX,
  Heart,
  MapPin,
  User,
} from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Paginator from "@/components/ui/paginator"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { dummyBooks } from "../_components/dummy-books"

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
  const { sort } = searchParams
  const t = await getTranslations("BookPage")
  const tRoute = await getTranslations("Routes")

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{tRoute("Home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">{tRoute("Books")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md">
          <Table className="border-separate border-spacing-x-0 border-spacing-y-4 overflow-hidden">
            <TableHeader className="bg-primary-foreground hover:bg-primary-foreground/95">
              <TableRow className="border-none hover:bg-primary-foreground/95">
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
                <SortableTableHead
                  currentSort={sort}
                  label={t("fields.liked")}
                  sortKey="heart"
                />
                <TableHead>{t("fields.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyBooks.map((item, index) => (
                <TableRow
                  key={index}
                  className="mt-4 overflow-hidden rounded-lg border-2 bg-primary-foreground px-8 shadow-md hover:bg-primary-foreground/95"
                >
                  <TableCell className="flex items-center gap-2">
                    <div className="flex gap-4 pl-2">
                      <Image
                        src={item.image}
                        priority
                        alt="Logo"
                        width={50}
                        height={60}
                        className="object-cover duration-150 ease-in-out hover:scale-105"
                      />
                      <div className="flex flex-col justify-center gap-2">
                        <Link
                          href={`/books/${item.id}`}
                          className="truncate text-nowrap text-xl font-semibold text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="flex items-center gap-2 font-semibold italic">
                          <User size={16} fill="gray" color="gray" /> by &nbsp;
                          {item.author}
                        </p>
                        <p>Second Edition</p>
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
                      {t("fields.preview")}
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
