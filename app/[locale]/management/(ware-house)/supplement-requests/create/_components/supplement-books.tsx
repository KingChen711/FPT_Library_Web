import React from "react"
import Image from "next/image"
import Link from "next/link"
import NoImage from "@/public/assets/images/no-image.png"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

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
import { Label } from "@/components/ui/label"
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
  form: UseFormReturn<TCreateSupplementRequestSchema>
}

function SupplementBooks({ form }: Props) {
  const books = form.watch("supplementRequestDetails")
  const t = useTranslations("TrackingsManagementPage")

  return (
    <div className="flex flex-col">
      <Label>{t("AI recommended items")}</Label>
      {books.length > 0 ? (
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Title")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Authors")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Publisher")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Published date")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("ISBN")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Page count")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Dimension")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Estimated price")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Language")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Categories")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Average rating")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Ratings count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Description")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Preview link")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Info link")}</div>
                  </TableHead>

                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books?.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="text-nowrap font-bold">
                      <div className="group flex items-center gap-2 pr-8">
                        {source.coverImageLink ? (
                          <Image
                            alt={source.title}
                            src={source.coverImageLink}
                            width={40}
                            height={60}
                            className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                          />
                        ) : (
                          <Image
                            alt={source.title}
                            src={NoImage}
                            width={40}
                            height={60}
                            className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                          />
                        )}
                        <p className="font-bold group-hover:underline">
                          {source.title || "-"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {source.author || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {source.publisher || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.publishedDate || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.isbn || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.pageCount ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.dimensions || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.estimatedPrice ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.language || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.categories || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <Rating value={source.averageRating} />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.ratingsCount ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.description ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto overflow-x-hidden">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml data={source.description} />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.previewLink ? (
                          <Button asChild variant="link">
                            <Link target="_blank" href={source.previewLink}>
                              {t("Open link")}
                            </Link>
                          </Button>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {source.infoLink ? (
                          <Button asChild variant="link">
                            <Link target="_blank" href={source.infoLink}>
                              {t("Open link")}
                            </Link>
                          </Button>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <Button
                        onClick={() => {
                          form.setValue(
                            "supplementRequestDetails",
                            books.filter((b) => b.id !== source.id)
                          )
                        }}
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
    </div>
  )
}

export default SupplementBooks
