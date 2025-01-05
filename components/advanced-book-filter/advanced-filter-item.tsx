"use client"

import { useState } from "react"
import {
  AdvancedFilterBookConstants,
  AdvancedFilterBookOption,
  type AdvancedFilterBookFields,
} from "@/constants/advanced-filter.constants"
import { Trash } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const AdvancedFilterItem = () => {
  const [currentField, setCurrentField] = useState<AdvancedFilterBookFields>()
  const [filterOption, setFilterOption] = useState<AdvancedFilterBookOption>()

  const handleChangeFilterOption = (option: AdvancedFilterBookFields) => {
    const field = AdvancedFilterBookConstants.find(
      (filter) => filter.field === option
    )
    setCurrentField(option)
    setFilterOption(field?.type)
  }

  const handleDeleteFilter = () => {}

  const renderCondition = (filterOption: AdvancedFilterBookOption) => {
    switch (filterOption) {
      case AdvancedFilterBookOption.TEXT:
        return (
          <div className="flex w-full items-center gap-4">
            <Select defaultValue="includes">
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`Search by ${currentField}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="includes">Includes</SelectItem>
                  <SelectItem value="equal">Equal</SelectItem>
                  <SelectItem value="not-equal">Not equal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="text"
              className="flex-1"
              placeholder={`Search by ${currentField}`}
            />
          </div>
        )
      case AdvancedFilterBookOption.DATE_TIME:
        return (
          <div className="flex w-full items-center gap-4">
            <Select defaultValue="includes">
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`Search by ${currentField}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="includes">Includes</SelectItem>
                  <SelectItem value="lt">Less than</SelectItem>
                  <SelectItem value="lte">Less than or equal to</SelectItem>
                  <SelectItem value="gt">Greater than</SelectItem>
                  <SelectItem value="gte">Greater than or equal to</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input type="date" className="flex-1" />
          </div>
        )
      case AdvancedFilterBookOption.SELECTION:
        return (
          <div className="flex w-full items-center gap-4">
            <Select defaultValue="1">
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`Search by ${currentField}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">{currentField} 1</SelectItem>
                  <SelectItem value="2">{currentField} 2</SelectItem>
                  <SelectItem value="3">{currentField} 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )
      case AdvancedFilterBookOption.RANGE_NUMBER:
        return (
          <div className="flex w-full items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>From</Label>
              <Input
                type="number"
                className="flex-1"
                placeholder="From"
                min={0}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>To</Label>
              <Input type="number" className="flex-1" placeholder="To" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section className="flex items-center gap-4">
      <Select
        onValueChange={(value: AdvancedFilterBookFields) =>
          handleChangeFilterOption(value)
        }
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Choose a field" />
        </SelectTrigger>
        <SelectContent>
          {AdvancedFilterBookConstants?.map((filter) => (
            <SelectItem key={filter.field} value={filter.field}>
              {filter.field}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filterOption && (
        <div className="flex-1">{renderCondition(filterOption)}</div>
      )}

      <Button onClick={handleDeleteFilter}>
        <Trash />
      </Button>
    </section>
  )
}

export default AdvancedFilterItem
