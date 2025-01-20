import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DocumentSearchBook = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"}>Kiểu tài liệu</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-2">
        <div className="flex flex-nowrap items-center gap-2">
          <Checkbox />
          <Label className="text-sm font-medium">Sách (456)</Label>
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <Checkbox />
          <Label className="text-sm font-medium">Luận văn / Luận án (30)</Label>
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <Checkbox />
          <Label className="text-sm font-medium">Tạp chí học thuật (27)</Label>
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <Checkbox />
          <Label className="text-sm font-medium">Ebooks (10)</Label>
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <Checkbox />
          <Label className="text-sm font-medium">Tài nguyên điện tử (28)</Label>
        </div>
        <Button variant={"destructive"}>Huỷ</Button>
        <Button>Áp dụng</Button>
      </PopoverContent>
    </Popover>
  )
}

export default DocumentSearchBook
