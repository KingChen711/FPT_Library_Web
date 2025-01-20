import { Filter, Search } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const SheetSearchBook = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} className="flex items-center gap-2">
          <Filter /> Tất cả bộ lọc
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <div className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter /> Tất cả bộ lọc
            </SheetTitle>
          </SheetHeader>
          <Accordion type="multiple">
            <AccordionItem value="item-0">
              <AccordionTrigger className="text-nowrap">
                Tìm kiếm nâng cao
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <label htmlFor="1">Sách (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="2" />
                    <label htmlFor="2">Luận văn (80)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="3" />
                    <label htmlFor="3">Tạp chí học thuật (145)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="4" />
                    <label htmlFor="4">Ebook (38)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="5" />
                    <label htmlFor="5">Tài nguyên điện tử (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="6" />
                    <label htmlFor="6">Video (65)</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-1">
              <AccordionTrigger className="text-nowrap">
                Nhà cung cấp nội dung
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-nowrap">
                Loại nguồn
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <label htmlFor="1">Sách (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="2" />
                    <label htmlFor="2">Luận văn (80)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="3" />
                    <label htmlFor="3">Tạp chí học thuật (145)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="4" />
                    <label htmlFor="4">Ebook (38)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="5" />
                    <label htmlFor="5">Tài nguyên điện tử (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="6" />
                    <label htmlFor="6">Video (65)</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-nowrap">
                Chủ đề
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <label htmlFor="1">Sách (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="2" />
                    <label htmlFor="2">Luận văn (80)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="3" />
                    <label htmlFor="3">Tạp chí học thuật (145)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="4" />
                    <label htmlFor="4">Ebook (38)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="5" />
                    <label htmlFor="5">Tài nguyên điện tử (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="6" />
                    <label htmlFor="6">Video (65)</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-nowrap">
                Nhà xuất bản
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <label htmlFor="1">Sách (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="2" />
                    <label htmlFor="2">Luận văn (80)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="3" />
                    <label htmlFor="3">Tạp chí học thuật (145)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="4" />
                    <label htmlFor="4">Ebook (38)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="5" />
                    <label htmlFor="5">Tài nguyên điện tử (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="6" />
                    <label htmlFor="6">Video (65)</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-nowrap">
                Ấn phẩm
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-2">
                <div className="relative pt-2">
                  <Input
                    size={12}
                    placeholder="Search nhà cung cấp nội dung"
                    className="pr-12"
                  />
                  <Search
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tài liệu được yêu thích nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <label htmlFor="1">Sách (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="2" />
                    <label htmlFor="2">Luận văn (80)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="3" />
                    <label htmlFor="3">Tạp chí học thuật (145)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="4" />
                    <label htmlFor="4">Ebook (38)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="5" />
                    <label htmlFor="5">Tài nguyên điện tử (45)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="6" />
                    <label htmlFor="6">Video (65)</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-nowrap">
                Năm xuất bản
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup defaultValue="a">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="1" />
                    <label htmlFor="1">Tất cả thời gian</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="2" />
                    <label htmlFor="2">2 tháng</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3" />
                    <label htmlFor="3">6 tháng</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="4" />
                    <label htmlFor="4">1 năm</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <label htmlFor="general">Tuỳ chỉnh</label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant={"default"}>Cập nhật các lựa chọn</Button>
          <Button variant={"destructive"}>Xoá</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetSearchBook
