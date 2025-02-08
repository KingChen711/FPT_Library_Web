import Image from "next/image"
import { Link } from "@/i18n/routing"
import getRelatedLibraryItemsByAuthor from "@/queries/library-item/get-related-libraryItems-by-author"
import { Cake, Earth, User } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { type LibraryItem } from "@/lib/types/models"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { StyledReadMore } from "@/components/ui/read-more"

type Props = {
  libraryItem: LibraryItem
}

const BookAuthorCard = async ({ libraryItem }: Props) => {
  const t = await getTranslations("BookPage")
  const libraryItems = await getRelatedLibraryItemsByAuthor({
    authorId: libraryItem.authors[0].authorId,
    pageIndex: 1,
    pageSize: "5",
    search: "",
  })

  console.log("🚀 ~ BookAuthorCard ~ libraryItem:", libraryItem)
  return (
    <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto rounded-lg border bg-primary-foreground p-4 shadow-lg">
      <div>
        <h1 className="text-xl font-semibold capitalize">
          <span className="text-primary">{t("about")}</span> &nbsp;
          {t("fields.author")}
        </h1>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="flex items-center gap-2">
              <User size={18} />
              {libraryItem?.authors.map((a) => a.fullName).join(", ")}
            </h1>

            {libraryItem.authors[0]?.dob && (
              <div className="flex items-center gap-2 text-sm">
                <Cake size={18} />
                {libraryItem.authors[0].dob
                  ? new Date(libraryItem.authors[0]?.dob).toDateString()
                  : "N/A"}
              </div>
            )}

            {libraryItem.authors[0]?.nationality && (
              <div className="flex items-center gap-2">
                <Earth size={18} /> {libraryItem.authors[0].nationality}
              </div>
            )}
          </div>

          {libraryItem?.authors[0]?.authorImage && (
            <Image
              key={libraryItem.authors[0].authorId}
              src={libraryItem?.authors[0].authorImage}
              alt="Author"
              width={100}
              height={120}
              className="rounded-lg object-cover"
            />
          )}
        </div>
        <StyledReadMore truncate={80}>
          {libraryItem.authors[0]?.biography}
        </StyledReadMore>
      </div>
      <div className="mt-auto">
        <h1 className="mt-4 text-xl font-semibold">{t("other books")}</h1>

        <div className="flex flex-1 items-center justify-center">
          {libraryItems.sources.length > 0 && (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-xl"
            >
              <CarouselContent className="flex h-full">
                {libraryItems.sources.map((item) => {
                  if (item.libraryItemId !== libraryItem.libraryItemId) {
                    return (
                      <CarouselItem
                        key={item.libraryItemId}
                        className="h-full shrink-0 basis-1/4"
                      >
                        <Link
                          href={`/books/${item.libraryItemId}`}
                          className="flex h-[80] items-center justify-center overflow-hidden rounded-lg shadow-lg"
                        >
                          <Image
                            src={item.coverImage || ""}
                            priority
                            alt="Logo"
                            width={240}
                            height={320}
                            className="object-cover duration-150 ease-in-out hover:scale-105"
                          />
                        </Link>
                      </CarouselItem>
                    )
                  }
                })}
              </CarouselContent>

              <CarouselPrevious className="absolute left-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
              <CarouselNext className="absolute right-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookAuthorCard
