import Image from "next/image"
import { Link } from "@/i18n/routing"
import {
  CheckCircle2,
  EllipsisVertical,
  ScrollText,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import SheetSearchBook from "../_components/sheet-search-book"
import { dummyBooks } from "../../_components/dummy-books"

const SearchResult = () => {
  return (
    <div className="container flex size-full flex-col gap-4 overflow-y-auto">
      <div className="w-full space-y-2">
        <div className="relative w-full p-2">
          <Input
            type="text"
            placeholder="Tìm kiếm các bài viết, sách, tạp chí và nhiều hơn nữa"
            className="w-full pr-12"
          />
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
        <SheetSearchBook />
      </div>

      <section className="flex items-center justify-between px-12">
        <div className="flex">
          <p className="font-semibold">Kết quả: 1.245</p>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hiển thị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Hiển thị: 10</SelectItem>
              <SelectItem value="20">Hiển thị: 20</SelectItem>
              <SelectItem value="50">Hiển thị: 50</SelectItem>
              <SelectItem value="100">Hiển thị: 100</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mức độ liên quan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Hiển thị: 10</SelectItem>
              <SelectItem value="20">Hiển thị: 20</SelectItem>
              <SelectItem value="50">Hiển thị: 50</SelectItem>
              <SelectItem value="100">Hiển thị: 100</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ScrollText /> Lịch sử tìm kiếm
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section className="space-y-4 px-12">
        {dummyBooks.map((book, i) => (
          <div key={i} className="rounded-lg border-2 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Sách</p>
              <Button asChild variant={"link"}>
                <Link
                  href={`/books/${book.id}`}
                  className="flex items-center gap-2"
                >
                  View Detail
                </Link>
              </Button>
            </div>
            <Separator className="my-2" />

            <div className="flex gap-4">
              <div className="flex w-1/8 justify-center">
                <Image
                  src={dummyBooks[i].image}
                  width={100}
                  height={100}
                  alt="book"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-primary">
                  {book.title}: Tài liệu giảng dạy / {book.author}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Tác giả</span> {book.author}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Chủ đề</span> Lịch sử thế giới
                  - Văn minh
                </div>
                <div className="flex gap-2">
                  <div className="w-fit font-semibold">Summary</div>
                  <span className="line-clamp-1">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Libero atque porro officiis incidunt quo dolorem cumque,
                    voluptatum rem veniam voluptates illum rerum, accusantium
                    doloremque perferendis quasi dolores aliquam? Quis, ipsum?
                  </span>
                </div>
              </div>
            </div>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số kệ</TableHead>
                  <TableHead>Kí hiệu xếp giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                    Available
                  </TableCell>
                  <TableCell>AGU-Institutional Resources - F3</TableCell>
                  <TableCell>909 G106 2024</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}
      </section>

      <Separator />
      <div className="flex h-5 items-center justify-center space-x-4 text-sm">
        <div>Chính sách riêng tư</div>
        <Separator orientation="vertical" />
        <div>Điều khoản sử dụng</div>
        <Separator orientation="vertical" />
        <div>Đăng xuất theo tổ chức</div>
        <Separator orientation="vertical" />
        <div>Quản lí cookies của bạn</div>
      </div>
    </div>
  )
}

export default SearchResult
