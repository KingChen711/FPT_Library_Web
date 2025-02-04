import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { EResourceBookType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  type TBookEditionSchema,
  type TBookResourceSchema,
} from "@/lib/validations/books/create-book"
import AudioDropzone from "@/components/ui/audio-dropzone"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import PDFDropzone from "@/components/ui/pdf-dropzone"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
}

const createBookResource = (type: EResourceBookType): TBookResourceSchema => {
  return {
    resourceTitle: "",
    fileFormat: "",
    //TODO: hardcode warning
    provider: "Cloudinary",
    providerPublicId: "",
    resourceSize: 0,
    resourceType: type,
    resourceUrl: "",
    borrowPrice: 0,
    defaultBorrowDurationDays: 0,
  }
}

function BookResourceFields({ form, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")
  const { fields, append, remove } = useFieldArray({
    name: "libraryResources",
    control: form.control,
  })

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className="flex flex-col gap-y-2 rounded-md border-2 py-4"
          >
            <div className="flex items-center justify-between gap-4 border-b-2 px-4 pb-2">
              <div className="flex items-center gap-x-3">
                <label className="flex items-center gap-2 font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {field.resourceType === EResourceBookType.EBOOK ? (
                    <Icons.Ebook className="size-6" />
                  ) : (
                    <Icons.AudioBook className="size-6" />
                  )}
                  {t(field.resourceType)}
                </label>
              </div>
              <Button
                disabled={isPending}
                onClick={() => {
                  remove(index)
                }}
                variant="ghost"
                size="icon"
              >
                <Trash2 className="size-6 text-danger" />
              </Button>
            </div>

            <div className="flex flex-col gap-y-4 p-4">
              <FormField
                control={form.control}
                name={`libraryResources.${index}.resourceTitle`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Resource title")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`libraryResources.${index}.borrowPrice`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Borrow price")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        type="number"
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`libraryResources.${index}.defaultBorrowDurationDays`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Default borrow duration")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        type="number"
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`libraryResources.${index}.file`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("File")}
                      <span className="mb-2 text-lg font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <>
                        {form.getValues(
                          `libraryResources.${index}.resourceType`
                        ) === EResourceBookType.EBOOK ? (
                          <PDFDropzone
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val)
                              form.setValue(
                                `libraryResources.${index}.resourceUrl`,
                                undefined
                              )
                            }}
                          />
                        ) : (
                          <AudioDropzone
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val)
                              form.setValue(
                                `libraryResources.${index}.resourceUrl`,
                                undefined
                              )
                            }}
                          />
                        )}

                        {/* //TODO:Record component */}
                      </>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )
      })}
      <div className="flex flex-wrap gap-4">
        <div
          onClick={() => {
            append(createBookResource(EResourceBookType.EBOOK))
          }}
          className={cn(
            "group flex min-w-fit flex-1 cursor-pointer items-center justify-center rounded-md border bg-muted py-4 font-bold",
            isPending && "pointer-events-none"
          )}
        >
          <Plus className="mr-1 size-5 font-extrabold group-hover:text-primary" />
          <p className="text-nowrap group-hover:text-primary">
            {t("More Ebook")}
          </p>
        </div>
        <div
          onClick={() => {
            append(createBookResource(EResourceBookType.AUDIO_BOOK))
          }}
          className={cn(
            "group flex min-w-fit flex-1 cursor-pointer items-center justify-center rounded-md border bg-muted py-4 font-bold",
            isPending && "pointer-events-none"
          )}
        >
          <Plus className="mr-1 size-5 font-extrabold group-hover:text-primary" />
          <p className="text-nowrap group-hover:text-primary">
            {t("More AudioBook")}
          </p>
        </div>
      </div>
    </>
  )
}

export default BookResourceFields
