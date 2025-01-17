import { Search } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

const QuickSearchTab = () => {
  return (
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

      <Button className="flex flex-nowrap items-center gap-2">
        <Search /> Search
      </Button>
    </div>
  )
}

export default QuickSearchTab
