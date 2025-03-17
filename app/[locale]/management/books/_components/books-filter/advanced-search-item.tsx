import { useEffect, useState } from "react"
import { EFilterOperator } from "@/constants/advance-search/common"
import {
  advancedFilters,
  EAdvancedFilterType,
  type EAdvancedFilterBookField,
  type TAdvancedFilters,
} from "@/constants/advanced-filter.constants"
import { Check, ChevronsUpDown, Trash } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { type FOV } from "./advanced-search-tab"

type Props = {
  fov: FOV
  selectedFields: EAdvancedFilterBookField[]
  onNewFov: () => void
  onChangeFov: (id: string, f: FOV) => void
  onDeleteFov: (id: string) => void
}

const defaultO = {
  [EAdvancedFilterType.TEXT]: EFilterOperator.INCLUDES,
  [EAdvancedFilterType.NUMBER]: EFilterOperator.EQUALS,
  [EAdvancedFilterType.DATE]: EFilterOperator.EQUALS,
  [EAdvancedFilterType.ENUM]: EFilterOperator.EQUALS,
}

const defaultV = {
  [EAdvancedFilterType.TEXT]: "",
  [EAdvancedFilterType.NUMBER]: 0,
  [EAdvancedFilterType.DATE]: [null, null] as [string | null, string | null],
  [EAdvancedFilterType.ENUM]: 0,
}

const AdvancedSearchItem = ({
  selectedFields,
  onChangeFov,
  onDeleteFov,
  fov,
}: Props) => {
  const t = useTranslations("BooksManagementPage")
  const [field, setField] = useState<TAdvancedFilters>()

  const [openSelectF, setOpenSelectF] = useState(false)

  const renderOperator = (field: TAdvancedFilters) => {
    switch (field.type) {
      case EAdvancedFilterType.TEXT:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              value={fov.o?.toString()}
              onValueChange={(value) =>
                onChangeFov(fov.id, {
                  ...fov,
                  o: +value,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EFilterOperator.INCLUDES.toString()}>
                  {t("Includes")}
                </SelectItem>
                <SelectItem value={EFilterOperator.EQUALS.toString()}>
                  {t("Equals")}
                </SelectItem>
                <SelectItem value={EFilterOperator.NOT_EQUALS_TO.toString()}>
                  {t("Not equals")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={fov.v.toString()}
              className="flex-1"
              placeholder="Enter text"
              onChange={(e) =>
                onChangeFov(fov.id, { ...fov, v: e.target.value })
              }
            />
          </div>
        )
      case EAdvancedFilterType.NUMBER:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              value={fov.o?.toString()}
              onValueChange={(value) =>
                onChangeFov(fov.id, {
                  ...fov,
                  o: +value,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EFilterOperator.EQUALS.toString()}>
                  {t("Equals")}
                </SelectItem>
                <SelectItem value={EFilterOperator.NOT_EQUALS_TO.toString()}>
                  {t("Not equals")}
                </SelectItem>
                <SelectItem value={EFilterOperator.LESS_THAN.toString()}>
                  {t("Less than")}
                </SelectItem>
                <SelectItem
                  value={EFilterOperator.LESS_THAN_OR_EQUALS_TO.toString()}
                >
                  {t("Less than or equals")}
                </SelectItem>
                <SelectItem value={EFilterOperator.GREATER_THAN.toString()}>
                  {t("Greater than")}
                </SelectItem>
                <SelectItem
                  value={EFilterOperator.GREATER_THAN_OR_EQUALS_TO.toString()}
                >
                  {t("Greater than or equals")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={fov.v as number}
              type="number"
              min={0}
              className="flex-1"
              placeholder="Enter number"
              onChange={(e) =>
                onChangeFov(fov.id, {
                  ...fov,
                  v: e.target.value,
                })
              }
            />
          </div>
        )
      case EAdvancedFilterType.DATE:
        return (
          <div className="flex w-full items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Label htmlFor={`from-${field.field}`}>From</Label>
              <Input
                value={
                  (fov.v as [string | null, string | null])[0] ?? undefined
                }
                id={`from-${field.field}`}
                type="date"
                onChange={(e) => {
                  const value = e.target.value || null

                  onChangeFov(fov.id, {
                    ...fov,
                    o: 0,
                    v: [value, (fov.v as [string | null, string | null])[1]], // "date,null"
                  })
                }}
              />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Label htmlFor={`to-${field.field}`}>To</Label>
              <Input
                value={
                  (fov.v as [string | null, string | null])[1] ?? undefined
                }
                id={`to-${field.field}`}
                type="date"
                onChange={(e) => {
                  const value = e.target.value || null
                  onChangeFov(fov.id, {
                    ...fov,
                    o: 0,
                    v: [(fov.v as [string | null, string | null])[0], value], // "date,null"
                  })
                }}
              />
            </div>
          </div>
        )
      case EAdvancedFilterType.ENUM:
        return (
          <div className="flex w-full items-center gap-2">
            <Select
              value={fov.o?.toString()}
              onValueChange={(value) =>
                onChangeFov(fov.id, {
                  ...fov,
                  o: +value,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EFilterOperator.EQUALS.toString()}>
                  {t("Equals")}
                </SelectItem>
                <SelectItem value={EFilterOperator.NOT_EQUALS_TO.toString()}>
                  {t("Not equals")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={fov.v.toString() || undefined}
              onValueChange={(value) =>
                onChangeFov(fov.id, {
                  ...fov,
                  v: value,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Choose")} />
              </SelectTrigger>
              <SelectContent>
                {field.selections?.map((selection) => (
                  <SelectItem
                    key={selection.value}
                    value={selection.value.toString()}
                  >
                    {t(selection.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return "..."
    }
  }

  useEffect(() => {
    if (!fov.f) return
    setField(() => advancedFilters.find((filter) => filter.field === fov.f))
  }, [fov.f])

  return (
    <div className="flex items-center gap-2">
      <Popover open={openSelectF} onOpenChange={setOpenSelectF}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSelectF}
            className="w-[200px] justify-between"
          >
            {fov.f
              ? t(advancedFilters.find((f) => f.field === fov.f)?.field)
              : t("Select")}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={t("Search")} className="h-9" />
            <CommandList>
              <CommandEmpty>{t("Not found")}</CommandEmpty>
              <CommandGroup>
                {advancedFilters.map((f) => {
                  const hasSelected = selectedFields.includes(f.field)
                  return (
                    <CommandItem
                      disabled={hasSelected}
                      key={f.field}
                      value={f.field}
                      onSelect={(currentValue: string) => {
                        onChangeFov(fov.id, {
                          ...fov,
                          f: currentValue as EAdvancedFilterBookField,
                          o: defaultO[f.type],
                          v: defaultV[f.type],
                        })
                        setOpenSelectF(false)
                      }}
                    >
                      {t(f.field)}
                      <Check
                        className={cn(
                          "ml-auto",
                          hasSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex-1">{field && renderOperator(field)}</div>

      <Trash
        onClick={() => onDeleteFov(fov.id)}
        color="red"
        size={16}
        className="cursor-pointer"
      />
    </div>
  )
}

export default AdvancedSearchItem
