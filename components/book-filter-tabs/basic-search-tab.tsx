import { RefreshCcw, Search } from "lucide-react"

import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"

const BasicSearchTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Nhan đề" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Tác giả" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Từ khóa" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Phân loại" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Năm xuất bản: Từ năm" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input
            placeholder="Năm xuất bản: Đền năm"
            className="border-dashed"
          />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Số ĐKCB" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="ISBN / ISSN" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
        <div className="flex w-full flex-nowrap items-center">
          <Input placeholder="Mọi trường" className="border-dashed" />
          <Checkbox className="ml-2" defaultChecked />
        </div>
      </div>
      <div className="flex items-center justify-start gap-4">
        <Button className="flex flex-nowrap items-center gap-2">
          <Search /> Search
        </Button>

        <Button
          variant="secondary"
          className="flex flex-nowrap items-center gap-2"
        >
          <RefreshCcw /> Reset
        </Button>
      </div>
    </div>
  )
}

export default BasicSearchTab
