import { useState } from "react"
import {
  AdvancedFilters,
  EAdvancedFilterType,
  type EAdvancedFilterBookFields,
  type TAdvancedFilters,
} from "@/constants/advanced-filter.constants"
import { LockKeyhole, LockKeyholeOpen, Trash } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { type TBookQuery } from "./advanced-search-tab"

type Props = {
  handleAddField: (field: TBookQuery) => void
  handleDeleteField: (key: EAdvancedFilterBookFields) => void
}

const AdvancedSearchItem = ({ handleAddField, handleDeleteField }: Props) => {
  const [field, setField] = useState<TAdvancedFilters>()
  const [dateQuery, setDateQuery] = useState<(string | null)[]>([null, null])
  const [bookQuery, setBookQuery] = useState<TBookQuery>()
  const [isLocked, setIsLocked] = useState(false)

  const handleLock = () => {
    if (!isLocked) {
      setIsLocked(true)
      handleAddField(bookQuery!)
    } else {
      setIsLocked(false)
      handleDeleteField(field!.field)
    }
  }

  const renderOperator = (field: TAdvancedFilters) => {
    switch (field.type) {
      case EAdvancedFilterType.DATE_TIME:
        return (
          <div className="flex w-full items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Label htmlFor={`from-${field.field}`}>From</Label>
              <Input
                id={`from-${field.field}`}
                type="date"
                disabled={isLocked}
                onChange={(e) => {
                  const value = e.target.value || null
                  setDateQuery((prev) => [value, prev[1]])
                  setBookQuery((prev) => ({
                    ...prev!,
                    filterOperator: null,
                    value: `${value || "null"},${dateQuery[1] || "null"}`, // "date,null"
                  }))
                }}
              />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Label htmlFor={`to-${field.field}`}>To</Label>
              <Input
                id={`to-${field.field}`}
                type="date"
                disabled={isLocked}
                onChange={(e) => {
                  const value = e.target.value || null
                  setDateQuery((prev) => [prev[0], value])
                  setBookQuery((prev) => ({
                    ...prev!,
                    filterOperator: null,
                    value: `${dateQuery[0] || "null"},${value || "null"}`, // "null,date"
                  }))
                }}
              />
            </div>
          </div>
        )
      case EAdvancedFilterType.ENUM_SELECTION:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              disabled={isLocked}
              onValueChange={(value) =>
                setBookQuery((prev) => ({
                  ...prev!,
                  filterOperator: Number(value),
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Equal</SelectItem>
                <SelectItem value="2">Not Equal</SelectItem>
              </SelectContent>
            </Select>
            <Select
              disabled={isLocked}
              onValueChange={(value) =>
                setBookQuery((prev) => ({
                  ...prev!,
                  value: value,
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {field.selections?.map((selection) => (
                  <SelectItem key={selection.value} value={selection.value}>
                    {selection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case EAdvancedFilterType.NORMAL_SELECTION:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              disabled={isLocked}
              onValueChange={(value) =>
                setBookQuery((prev) => ({
                  ...prev!,
                  filterOperator: Number(value),
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Includes</SelectItem>
                <SelectItem value="1">Equal</SelectItem>
                <SelectItem value="2">Not Equal</SelectItem>
              </SelectContent>
            </Select>
            <Select
              disabled={isLocked}
              onValueChange={(value) =>
                setBookQuery((prev) => ({
                  ...prev!,
                  value: value,
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {field.selections?.map((selection) => (
                  <SelectItem key={selection.value} value={selection.value}>
                    {selection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case EAdvancedFilterType.RANGE_NUMBER:
        return (
          <div className="flex w-full items-center gap-2">
            <Select disabled={isLocked}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Equal</SelectItem>
                <SelectItem value="2">Not Equal</SelectItem>
                <SelectItem value="3">Less Than</SelectItem>
                <SelectItem value="4">Less Than or Equal</SelectItem>
                <SelectItem value="5">Greater Than</SelectItem>
                <SelectItem value="6">Greater Than or Equal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              disabled={isLocked}
              type="number"
              min={0}
              className="flex-1"
              placeholder="Enter number"
            />
          </div>
        )
      case EAdvancedFilterType.TEXT:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              disabled={isLocked}
              onValueChange={(value) =>
                setBookQuery((prev) => ({
                  ...prev!,
                  filterOperator: Number(value),
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Includes</SelectItem>
                <SelectItem value="1">Equal</SelectItem>
                <SelectItem value="2">Not Equal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              disabled={isLocked}
              className="flex-1"
              placeholder="Enter text"
              onChange={(e) =>
                setBookQuery((prev) => ({ ...prev!, value: e.target.value }))
              }
            />
          </div>
        )
      default:
        return "..."
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        disabled={isLocked}
        onValueChange={(value: EAdvancedFilterBookFields) => {
          setField(() =>
            AdvancedFilters.find((filter) => filter.field === value)
          )
          setBookQuery((prev) => ({
            ...prev!,
            key: value,
          }))
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          {AdvancedFilters.map((filter: TAdvancedFilters) => (
            <SelectItem key={filter.field} value={filter.field}>
              {filter.field}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1">{field && renderOperator(field)}</div>
      <Trash color="red" size={16} className="cursor-pointer" />

      <Button variant="ghost" onClick={handleLock}>
        {isLocked ? <LockKeyhole /> : <LockKeyholeOpen />}
      </Button>
    </div>
  )
}

export default AdvancedSearchItem
