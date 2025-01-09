import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { EResourceBookType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  type TBookResourceSchema,
  type TMutateBookSchema,
} from "@/lib/validations/books/mutate-book"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type Props = {
  form: UseFormReturn<TMutateBookSchema>
  isPending: boolean
}

const createBookResource = (type: EResourceBookType): TBookResourceSchema => {
  return {
    title: "",
    fileFormat: "",
    //TODO: hardcode warning
    provider: "Cloudinary",
    providerPublicId: "",
    resourceSize: 0,
    resourceType: type,
    resourceUrl: "",
    file: new File([], "file"),
  }
}

function BookResourceFields({ form, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")
  const { fields, append, remove } = useFieldArray({
    name: "bookResources",
    control: form.control,
  })

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
    bookResourceIndex: number
  ) => {
    const file = e.target.files?.[0]
    //TODO: check type file
    // if (!file?.type.includes("audio")) return
    if (file) {
      const url = URL.createObjectURL(file)
      fieldChange(url)
      form.setValue(`bookResources.${bookResourceIndex}.file`, file)
    }
  }

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
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                name={`bookResources.${index}.title`}
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
                name={`bookResources.${index}.resourceUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      File
                      <span className="text-lg font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={isPending}
                          onChange={(e) =>
                            handleFileUpload(e, field.onChange, index)
                          }
                          type="file"
                          accept={
                            form.getValues(
                              `bookResources.${index}.resourceType`
                            ) === EResourceBookType.AUDIO_BOOK
                              ? "audio/*"
                              : "application/pdf"
                          }
                          className="w-fit"
                        />

                        {/* <Recording srcUrl={field.value || null} /> */}
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
