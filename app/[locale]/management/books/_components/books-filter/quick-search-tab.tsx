import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const QuickSearchTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Keywords" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">Tìm nhanh</SelectItem>
            <SelectItem value="title">Nhan đề</SelectItem>
            <SelectItem value="author">Tác giả</SelectItem>
            <SelectItem value="keyword">Từ khóa</SelectItem>
            <SelectItem value="ISBN">Số ISBN</SelectItem>
            <SelectItem value="category">Chỉ số phân loại</SelectItem>
            <SelectItem value="published">Năm xuất bản</SelectItem>
          </SelectContent>
        </Select>

        <Input className="flex-1" placeholder="Enter search value" />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start gap-8">
          <div className="flex items-center gap-2">
            <Checkbox id="search-no-mark" />
            <Label
              className="cursor-pointer font-normal"
              htmlFor="search-no-mark"
            >
              Tìm không dấu
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="search-exact" />
            <Label
              className="cursor-pointer font-normal"
              htmlFor="search-exact"
            >
              Kết quả chính xác
            </Label>
          </div>
        </div>
        <Button className="flex flex-nowrap items-center gap-2">
          <Search /> Search
        </Button>
      </div>
    </div>
  )
}

export default QuickSearchTab
