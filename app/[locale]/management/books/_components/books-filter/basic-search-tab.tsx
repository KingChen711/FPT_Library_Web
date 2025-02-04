import { useState } from "react"
import { RefreshCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const BasicSearchTab = () => {
  const [values, setValues] = useState({
    title: "",
    author: "",
    keyword: "",
    category: "",
    yearFrom: "",
    yearTo: "",
    registration: "",
    isbn: "",
    allFields: "",
  })

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const resetFields = () => {
    setValues({
      title: "",
      author: "",
      keyword: "",
      category: "",
      yearFrom: "",
      yearTo: "",
      registration: "",
      isbn: "",
      allFields: "",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(values).map((key, index) => (
          <div key={index} className="flex w-full flex-nowrap items-center">
            <Input
              placeholder={getPlaceholder(key)}
              className="border-dashed"
              value={values[key as keyof typeof values]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
            <Checkbox
              className="ml-2"
              checked={!!values[key as keyof typeof values]}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start gap-4">
        <Button className="flex flex-nowrap items-center gap-2">
          <Search /> Search
        </Button>

        <Button
          variant="secondary"
          className="flex flex-nowrap items-center gap-2"
          onClick={resetFields}
        >
          <RefreshCcw /> Reset
        </Button>
      </div>
    </div>
  )
}

const getPlaceholder = (key: string) => {
  const placeholders: { [key: string]: string } = {
    title: "Nhan đề",
    author: "Tác giả",
    keyword: "Từ khóa",
    category: "Phân loại",
    yearFrom: "Năm xuất bản: Từ năm",
    yearTo: "Năm xuất bản: Đến năm",
    registration: "Số ĐKCB",
    isbn: "ISBN / ISSN",
    allFields: "Mọi trường",
  }
  return placeholders[key] || ""
}

export default BasicSearchTab
