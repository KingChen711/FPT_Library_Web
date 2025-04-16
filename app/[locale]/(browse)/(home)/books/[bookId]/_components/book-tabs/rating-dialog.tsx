"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  mutateRatingSchema,
  type TMutateRatingSchema,
} from "@/lib/validations/rating/mutate-rating-schema"
import { mutateRating } from "@/actions/rating/mutate-rating"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { Icons } from "@/components/ui/icons"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const rateValueToText = ["Very Poor", "Poor", "Average", "Good", "Excellent"]

type Props = {
  libraryItemId: number
  ratingValue?: number
  reviewText?: string
}

function RatingDialog({ libraryItemId, ratingValue, reviewText }: Props) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const form = useForm<TMutateRatingSchema>({
    resolver: zodResolver(mutateRatingSchema),
    defaultValues: {
      ratingValue: ratingValue || 5,
      libraryItemId,
      reviewText: reviewText || "",
    },
  })

  const [isPending, startTransition] = useTransition()

  async function onSubmit(values: TMutateRatingSchema) {
    startTransition(async () => {
      const res = await mutateRating(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const t = useTranslations("BookPage")

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icons.Review className="size-4" /> {t("Add review")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {t("Review book")}
          </DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-2">
                  <div className="mt-2 shrink-0 text-sm font-bold">
                    {t("Satisfaction level")}
                  </div>
                  <FormField
                    control={form.control}
                    name="ratingValue"
                    render={({ field }) => (
                      <FormItem className="flex w-full justify-center">
                        <div className="flex flex-col items-center space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(+value)}
                              defaultValue={field.value.toString()}
                              className="flex"
                            >
                              {Array(5)
                                .fill(null)
                                .map((_, index) => {
                                  return (
                                    <FormItem key={index}>
                                      <FormControl>
                                        <RadioGroupItem
                                          className="hidden"
                                          value={(index + 1).toString()}
                                        />
                                      </FormControl>
                                      <FormLabel>
                                        {field.value > index ? (
                                          <Icons.FillStar className="size-8 cursor-pointer text-warning" />
                                        ) : (
                                          <Icons.Star className="size-8 cursor-pointer" />
                                        )}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                })}
                            </RadioGroup>
                          </FormControl>
                          <p
                            className="text-center text-warning"
                            id="rating-text"
                          >
                            {t(rateValueToText[field.value - 1])}
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reviewText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Content")}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4 flex justify-end gap-3">
                  <DialogClose>
                    <Button
                      variant="outline"
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpen(false)
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>
                  <Button disabled={isPending} type="submit">
                    {t("Continue")}
                    {isPending && <Loader2 className="size-4 animate-spin" />}
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

export default RatingDialog
