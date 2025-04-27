import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  type UseFormReturn,
} from "react-hook-form"

import { type TCreateSupplementRequestSchema } from "@/lib/validations/supplement/create-supplement-request"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ParseHtml from "@/components/ui/parse-html"
import Rating from "@/components/ui/rating"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  fields: FieldArrayWithId<
    TCreateSupplementRequestSchema,
    "supplementRequestDetails",
    "id"
  >[]
  remove: UseFieldArrayRemove
  form: UseFormReturn<TCreateSupplementRequestSchema>
  isPending: boolean
}

function SupplementBooks({ fields, form, remove, isPending }: Props) {
  const t = useTranslations("TrackingsManagementPage")

  return (
    <>
      <FormField
        control={form.control}
        name="supplementRequestDetails"
        render={() => (
          <FormItem>
            <FormLabel>{t("AI recommended items")}</FormLabel>
            <FormControl>
              {fields.length > 0 ? (
                <div className="mt-4 grid w-full">
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="overflow-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-nowrap border font-bold">
                            {t("Title")}
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            {t("Authors")}
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            {t("Publisher")}
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Published date")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("ISBN")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Page count")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Dimension")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Estimated price")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Language")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Categories")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Average rating")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Ratings count")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Description")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Preview link")}
                            </div>
                          </TableHead>

                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Info link")}
                            </div>
                          </TableHead>
                          <TableHead className="text-nowrap border font-bold">
                            <div className="flex justify-center">
                              {t("Supplement request reason")}
                            </div>
                          </TableHead>
                          <TableHead className="border"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields?.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell className="cursor-not-allowed text-nowrap border font-bold text-muted-foreground">
                              <div className="flex items-center gap-2 pr-8">
                                {field.coverImageLink ? (
                                  <Image
                                    alt={field.title}
                                    src={field.coverImageLink}
                                    width={40}
                                    height={60}
                                    className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                                  />
                                ) : (
                                  <Image
                                    alt={field.title}
                                    src={NoImage}
                                    width={40}
                                    height={60}
                                    className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                                  />
                                )}
                                <p className="font-bold">
                                  {field.title || "-"}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              {field.author || "-"}
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              {field.publisher || "-"}
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              <div className="flex justify-center">
                                {field.publishedDate || "-"}
                              </div>
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              <div className="flex justify-center">
                                {field.isbn || "-"}
                              </div>
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              <div className="flex justify-center">
                                {field.pageCount ?? "-"}
                              </div>
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                                {field.dimensions || "-"}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                                {field.estimatedPrice ?? "-"}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                                {field.language || "-"}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                                {field.categories || "-"}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex justify-center text-muted-foreground">
                                <Rating value={field.averageRating} />
                              </div>
                            </TableCell>

                            <TableCell className="cursor-not-allowed text-nowrap border text-muted-foreground">
                              <div className="flex justify-center">
                                {field.ratingsCount ?? "-"}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex justify-center">
                                {field.description ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        {t("View content")}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto overflow-x-hidden">
                                      <DialogHeader>
                                        <DialogTitle>
                                          {t("Description")}
                                        </DialogTitle>
                                        <DialogDescription>
                                          <ParseHtml data={field.description} />
                                        </DialogDescription>
                                      </DialogHeader>
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex justify-center">
                                {field.previewLink ? (
                                  <Button asChild variant="link">
                                    <Link
                                      target="_blank"
                                      href={field.previewLink}
                                    >
                                      {t("Open link")}
                                    </Link>
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <div className="flex justify-center">
                                {field.infoLink ? (
                                  <Button asChild variant="link">
                                    <Link target="_blank" href={field.infoLink}>
                                      {t("Open link")}
                                    </Link>
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="border">
                              <FormField
                                control={form.control}
                                name={`supplementRequestDetails.${index}.supplementRequestReason`}
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex w-full justify-center">
                                      <FormControl>
                                        <Input
                                          disabled={isPending}
                                          {...field}
                                          className="w-full min-w-60 !border-none px-0 !shadow-none !outline-none !ring-0"
                                        />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>

                            <TableCell className="text-nowrap border">
                              <Button
                                onClick={() => remove(index)}
                                variant="ghost"
                                size="icon"
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t("No selected items")}
                </div>
              )}
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

export default SupplementBooks
