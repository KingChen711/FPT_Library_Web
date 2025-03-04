import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TExtendCardSchema } from "@/lib/validations/patrons/cards/extend-card"
import usePackages from "@/hooks/packages/use-packages"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PackageCard from "@/components/ui/package-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  form: UseFormReturn<TExtendCardSchema>
  isPending: boolean
}

function SelectPackageField({ form, isPending }: Props) {
  const t = useTranslations("LibraryCardManagementPage")

  const [open, setOpen] = useState(false)

  const selectedPackage = form.watch("package")

  const { data: packageItems } = usePackages()

  return (
    <FormField
      control={form.control}
      name="libraryCardPackageId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {t("Package")}
            <span className="ml-1 text-xl font-bold leading-none text-primary">
              *
            </span>
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={isPending}
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-72 justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {t("Select package")}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <div className="flex max-h-[400px] w-full flex-col overflow-y-auto overflow-x-hidden">
                  {packageItems?.map((_package) => (
                    <PackageCard
                      key={_package.libraryCardPackageId}
                      className="rounded-none"
                      package={_package}
                      onClick={() => {
                        form.setValue(`package`, _package)
                        form.setValue(
                          `libraryCardPackageId`,
                          _package.libraryCardPackageId
                        )
                        form.clearErrors("libraryCardPackageId")
                        setOpen(false)
                      }}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </FormControl>
          <div className="flex items-center gap-4">
            {selectedPackage && <PackageCard package={selectedPackage} />}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SelectPackageField
