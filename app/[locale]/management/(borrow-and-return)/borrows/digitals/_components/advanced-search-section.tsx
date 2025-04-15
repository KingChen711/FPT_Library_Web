"use client"

import { useMemo, useState, type SetStateAction } from "react"
import {
  defaultO,
  defaultV,
  EAdvancedFilterType,
  operators,
  type EFilterOperator,
} from "@/constants/advance-search/common"
import {
  borrowDigitalAdvancedFilters,
  EAdvancedFilterBorrowDigitalField,
} from "@/constants/advanced-filter-borrow-digitals"
import { CommandList } from "cmdk"
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { v4 as uuidv4 } from "uuid"

import { EResourceBookType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
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

export type FOV = {
  id: string
  f: EAdvancedFilterBorrowDigitalField | null
  o: EFilterOperator | null
  v: string | number | [Date | null, Date | null] | null
}

type Props = {
  queries: FOV[]
  setQueries: React.Dispatch<SetStateAction<FOV[]>>
}

const AdvancedSearchSection = ({ queries, setQueries }: Props) => {
  const t = useTranslations("BorrowAndReturnManagementPage")

  const selectedFields = useMemo(
    () =>
      queries
        .map((item) => item.f)
        .filter(Boolean) as EAdvancedFilterBorrowDigitalField[],
    [queries]
  )

  const handleDeleteFov = (id: string) =>
    setQueries((prev) => prev.filter((f) => f.id !== id))

  const handleChangeFov = (fov: FOV) => {
    setQueries((prev) => prev.map((item) => (item.id === fov.id ? fov : item)))
  }

  const handleAddFov = () => {
    if (queries.length >= borrowDigitalAdvancedFilters.length) return
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
        />
      ))}
      <div className="flex items-center justify-between">
        <Button onClick={handleAddFov} className="flex items-center gap-2">
          <Plus />
          {t("Add")}
        </Button>
      </div>
    </div>
  )
}

export default AdvancedSearchSection

type AdvancedSearchItemProps = {
  fov: FOV
  selectedFields: EAdvancedFilterBorrowDigitalField[]
  onDeleteFov: () => void
  onChangeFov: (fov: FOV) => void
}

export function AdvancedSearchItem({
  fov,
  selectedFields,
  onDeleteFov,
  onChangeFov,
}: AdvancedSearchItemProps) {
  const t = useTranslations("BorrowAndReturnManagementPage")

  const tOperator = useTranslations("Badges.Operator")

  const type = useMemo(
    () =>
      fov.f
        ? (borrowDigitalAdvancedFilters.find((a) => a.field === fov.f)!.type ??
          null)
        : null,
    [fov.f]
  )

  const [openSelectF, setOpenSelectF] = useState(false)

  const tResourceType = useTranslations("Badges.ResourceBookType")

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
                  borrowDigitalAdvancedFilters.find((f) => f.field === fov.f)
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
                {borrowDigitalAdvancedFilters.map((f) => {
                  const hasSelected = selectedFields.includes(f.field)
                  return (
                    <CommandItem
                      disabled={hasSelected}
                      key={f.field}
                      value={t(f.field)}
                      onSelect={() => {
                        onChangeFov({
                          ...fov,
                          f: f.field as EAdvancedFilterBorrowDigitalField,
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
      {type !== null ? (
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

      {type === EAdvancedFilterType.NUMBER && (
        <Input
          value={fov.v?.toString()}
          className="flex-1"
          type="number"
          onChange={(e) => onChangeFov({ ...fov, v: e.target.value })}
        />
      )}

      {fov.f === EAdvancedFilterBorrowDigitalField.RESOURCE_TYPE && (
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
            {Object.values(EResourceBookType).map((ope) => (
              <SelectItem key={ope} value={ope}>
                {tResourceType(ope)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
