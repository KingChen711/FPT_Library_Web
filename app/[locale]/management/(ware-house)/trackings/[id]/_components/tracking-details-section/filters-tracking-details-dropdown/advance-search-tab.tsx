"use client"

import { useMemo, useState, type SetStateAction } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  defaultO,
  defaultV,
  EAdvancedFilterType,
  operators,
} from "@/constants/advance-search/common"
import {
  EAdvancedFilterTrackingDetailField,
  trackingDetailAdvancedFilters,
} from "@/constants/advanced-filter-tracking-details"
import { getLocalTimeZone } from "@internationalized/date"
import { CommandList } from "cmdk"
import { format } from "date-fns"
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { v4 as uuidv4 } from "uuid"

import { ESearchType, EStockTransactionType } from "@/lib/types/enums"
import { cn, formUrlQuery } from "@/lib/utils"
import useCategories from "@/hooks/categories/use-categories"
import useConditions from "@/hooks/conditions/use-conditions"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

import { type FOV } from "."

type Props = {
  trackingId: number
  hasGlueBarcode: boolean | undefined
  setHasGlueBarcode: (val: boolean | undefined) => void
  setOpen: (val: boolean) => void
  queries: FOV[]
  setQueries: React.Dispatch<SetStateAction<FOV[]>>
}

const AdvancedSearchTab = ({
  hasGlueBarcode,
  setHasGlueBarcode,
  setOpen,
  queries,
  setQueries,
}: Props) => {
  const t = useTranslations("TrackingsManagementPage")
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedFields = useMemo(
    () =>
      queries
        .map((item) => item.f)
        .filter(Boolean) as EAdvancedFilterTrackingDetailField[],
    [queries]
  )

  const handleDeleteFov = (id: string) =>
    setQueries((prev) => prev.filter((f) => f.id !== id))

  const handleChangeFov = (fov: FOV) => {
    setQueries((prev) => prev.map((item) => (item.id === fov.id ? fov : item)))
  }

  const handleApply = () => {
    const filteredQuery = queries
      .filter((fov) => !!fov.f)
      .map((f) => {
        if (Array.isArray(f.v)) {
          return {
            ...f,
            v: f.v
              .map((a) =>
                a === null ? "null" : format(new Date(a), "yyyy-MM-dd")
              )
              .join(","),
            id: undefined,
          }
        }
        return { ...f, id: undefined }
      })

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        f: filteredQuery.map((f) => f.f),
        o: filteredQuery.map((f) => (f.o === null ? "null" : f.o.toString())),
        v: filteredQuery.map((f) => f.v?.toString() || ""),
        search: null,
        pageIndex: "1",
        searchType: ESearchType.ADVANCED_SEARCH.toString(),
        hasGlueBarcode:
          hasGlueBarcode === undefined ? null : hasGlueBarcode.toString(),
      },
    })
    setOpen(false)
    console.log(newUrl)

    router.push(newUrl, { scroll: false })
  }

  const handleAddFov = () => {
    if (queries.length >= trackingDetailAdvancedFilters.length) return
    setQueries((prev) => [...prev, { id: uuidv4(), f: null, o: null, v: null }])
  }

  return (
    <div className="space-y-4">
      {queries.map((fov) => (
        <AdvancedSearchItem
          key={fov.id}
          fov={fov}
          onDeleteFov={() => handleDeleteFov(fov.id)}
          selectedFields={selectedFields}
          onChangeFov={(fov: FOV) => handleChangeFov(fov)}
          //   selectedFields={selectedFields}
          //   onNewFov={handleNewFov}
        />
      ))}
      <div className="flex items-center justify-between">
        <Button onClick={handleAddFov} className="flex items-center gap-2">
          <Plus />
          {t("Add")}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setQueries([])
              setHasGlueBarcode(undefined)
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            {t("Reset")}
          </Button>
          <Button
            onClick={handleApply}
            variant="default"
            className="flex items-center gap-2"
          >
            {t("Apply")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchTab

type AdvancedSearchItemProps = {
  fov: FOV
  selectedFields: EAdvancedFilterTrackingDetailField[]
  onDeleteFov: () => void
  onChangeFov: (fov: FOV) => void
}

export function AdvancedSearchItem({
  fov,
  selectedFields,
  onDeleteFov,
  onChangeFov,
}: AdvancedSearchItemProps) {
  const timezone = getLocalTimeZone()
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const tOperator = useTranslations("Badges.Operator")
  const tStockTransactionType = useTranslations("Badges.StockTransactionType")

  const [openComboboxCondition, setOpenComboboxCondition] = useState(false)
  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)

  const { data: categoryItems } = useCategories()
  const { data: conditionItems } = useConditions()

  const type = useMemo(
    () =>
      fov.f
        ? (trackingDetailAdvancedFilters.find((a) => a.field === fov.f)!.type ??
          null)
        : null,
    [fov.f]
  )

  const [openSelectF, setOpenSelectF] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {/* field */}
      <Popover open={openSelectF} onOpenChange={setOpenSelectF}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSelectF}
            className="w-[200px] shrink-0 justify-between"
          >
            {fov.f
              ? t(
                  trackingDetailAdvancedFilters.find((f) => f.field === fov.f)
                    ?.field
                )
              : t("Select")}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] shrink-0 p-0" side="bottom">
          <Command>
            <CommandInput placeholder={t("Search")} className="h-9" />
            <CommandList className="max-h-[50dvh] overflow-y-auto">
              <CommandEmpty>{t("Not found")}</CommandEmpty>
              <CommandGroup>
                {trackingDetailAdvancedFilters.map((f) => {
                  const hasSelected = selectedFields.includes(f.field)
                  return (
                    <CommandItem
                      disabled={hasSelected}
                      key={f.field}
                      value={t(f.field)}
                      onSelect={() => {
                        onChangeFov({
                          ...fov,
                          f: f.field as EAdvancedFilterTrackingDetailField,
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

      {/* operator */}
      {type !== null && type !== EAdvancedFilterType.DATE ? (
        <div className="w-[200px]">
          <Select
            value={fov.o?.toString()}
            onValueChange={(value) =>
              onChangeFov({
                ...fov,
                o: +value,
              })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue className="w-[200px]" placeholder={t("Select")} />
            </SelectTrigger>

            <SelectContent className="w-[200px]">
              {operators[type].map((ope) => (
                <SelectItem key={ope} value={ope.toString()}>
                  {tOperator(ope.toString())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {/* value */}
      {type === EAdvancedFilterType.TEXT && (
        <Input
          value={fov.v?.toString()}
          className="flex-1"
          onChange={(e) => onChangeFov({ ...fov, v: e.target.value })}
        />
      )}

      {type === EAdvancedFilterType.NUMBER && (
        <Input
          value={fov.v?.toString()}
          className="flex-1"
          type="number"
          onChange={(e) => onChangeFov({ ...fov, v: e.target.value })}
        />
      )}

      {type === EAdvancedFilterType.DATE && (
        <div className="flex w-full items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Label htmlFor={`from-${fov.id}`}>{t("From")}</Label>
            <DateTimePicker
              value={(() => {
                const dateRage = fov.v as [Date | null, Date | null]
                return dateRage[0] ? createCalendarDate(dateRage[0]) : null
              })()}
              onChange={(date) => {
                const dateRage = fov.v as [Date | null, Date | null]
                onChangeFov({
                  ...fov,
                  v: [date ? date.toDate(timezone) : null, dateRage[1] || null],
                })
              }}
              disabled={(date) => {
                const dateRage = fov.v as [Date | null, Date | null]
                return !!dateRage[1] && date > new Date(dateRage[1])
              }}
            />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Label htmlFor={`to-${fov.id}`}>{t("To")}</Label>
            <DateTimePicker
              value={(() => {
                const dateRage = fov.v as [Date | null, Date | null]
                return dateRage[1] ? createCalendarDate(dateRage[1]) : null
              })()}
              onChange={(date) => {
                const dateRage = fov.v as [Date | null, Date | null]
                onChangeFov({
                  ...fov,
                  v: [dateRage[0] || null, date ? date.toDate(timezone) : null],
                })
              }}
              disabled={(date) => {
                const dateRage = fov.v as [Date | null, Date | null]
                return !!dateRage[0] && date < new Date(dateRage[0])
              }}
            />
          </div>
        </div>
      )}

      {fov.f === EAdvancedFilterTrackingDetailField.STOCK_TRANSACTION_TYPE && (
        <Select
          value={fov.v?.toString()}
          onValueChange={(value) =>
            onChangeFov({
              ...fov,
              v: +value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select")} />
          </SelectTrigger>

          <SelectContent>
            {Object.values(EStockTransactionType)
              .filter((e) => typeof e === "number")
              .map((ope) => (
                <SelectItem key={ope} value={ope.toString()}>
                  {tStockTransactionType(ope.toString())}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {fov.f === EAdvancedFilterTrackingDetailField.CONDITION && (
        <Popover
          open={openComboboxCondition}
          onOpenChange={setOpenComboboxCondition}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-40 justify-between",
                !fov.v && "text-muted-foreground"
              )}
            >
              {fov.v
                ? locale === "vi"
                  ? conditionItems?.find(
                      (condition) => condition.conditionId === fov.v
                    )?.vietnameseName
                  : conditionItems?.find(
                      (condition) => condition.conditionId === fov.v
                    )?.englishName
                : t("Select condition")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {conditionItems?.map((condition) => (
                    <CommandItem
                      value={
                        locale === "vi"
                          ? condition.vietnameseName
                          : condition.englishName
                      }
                      key={condition.conditionId}
                      onSelect={() => {
                        onChangeFov({ ...fov, v: condition.conditionId })
                        setOpenComboboxCondition(false)
                      }}
                    >
                      {locale === "vi"
                        ? condition.vietnameseName
                        : condition.englishName}
                      <Check
                        className={cn(
                          "ml-auto",
                          condition.conditionId === fov.v
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {fov.f === EAdvancedFilterTrackingDetailField.CATEGORY && (
        <Popover
          open={openComboboxCategory}
          onOpenChange={setOpenComboboxCategory}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-40 justify-between",
                !fov.v && "text-muted-foreground"
              )}
            >
              {fov.v
                ? locale === "vi"
                  ? categoryItems?.find(
                      (category) => category.categoryId === fov.v
                    )?.vietnameseName
                  : categoryItems?.find(
                      (category) => category.categoryId === fov.v
                    )?.englishName
                : t("Select category")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {categoryItems?.map((category) => (
                    <CommandItem
                      value={
                        locale === "vi"
                          ? category.vietnameseName
                          : category.englishName
                      }
                      key={category.categoryId}
                      onSelect={() => {
                        onChangeFov({ ...fov, v: category.categoryId })
                        setOpenComboboxCategory(false)
                      }}
                    >
                      {locale === "vi"
                        ? category.vietnameseName
                        : category.englishName}
                      <Check
                        className={cn(
                          "ml-auto",
                          category.categoryId === fov.v
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onDeleteFov}
        className="shrink-0"
      >
        <Trash color="red" size={16} className="cursor-pointer" />
      </Button>
    </div>
  )
}
