"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const genderOptions = ["All", "Male", "Female"] as const

export const filterFineSchema = z.object({
  gender: z.enum(genderOptions),
  createdDateRange: z.array(z.date().or(z.null())),
})

export type TFilterFineSchema = z.infer<typeof filterFineSchema>

function FiltersFinesDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()

  const form = useForm<TFilterFineSchema>({
    resolver: zodResolver(filterFineSchema),
    defaultValues: {
      gender: "All",
      createdDateRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("gender", "All")
    form.setValue("createdDateRange", [null, null])
  }

  const onSubmit = async (values: TFilterFineSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        gender: values.gender,
        createdDateRange: values.createdDateRange.map((date) =>
          date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
        ),
      },
    })
    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full rounded-l-none" variant="outline">
          <Filter />
          {/* TODO:i18n */}
          Filter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle>Filter fines</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created date</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <DateTimePicker
                          jsDate={field.value[0] || undefined}
                          onJsDateChange={(date) =>
                            field.onChange([date || null, field.value[1]])
                          }
                          disabled={(date) =>
                            !!field.value[1] && date > new Date(field.value[1])
                          }
                        />

                        <div>-</div>

                        <DateTimePicker
                          jsDate={field.value[1] || undefined}
                          onJsDateChange={(date) =>
                            field.onChange([field.value[0], date || null])
                          }
                          disabled={(date) =>
                            !!field.value[0] && date < new Date(field.value[0])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button variant="secondary" className="float-right mt-4">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="secondary"
                    className="float-right mt-4"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      resetFilters()
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" className="float-right mt-4">
                    Apply{" "}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FiltersFinesDialog
