import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoData from "@/public/assets/images/no-data.png"
import getRelatedLibraryItemsByAuthor from "@/queries/library-item/get-related-libraryItems-by-author"
import { Cake, Earth, User } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
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
  const locale = await getLocale()

  if (libraryItem.authors.length === 0) {
    return (
      <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto rounded-md border bg-card p-4 shadow-lg">
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-xl font-semibold capitalize">
            <span className="text-primary">
              {t(locale === "vi" ? "info" : "about")}
            </span>
            &nbsp;
            {t("fields.author")}
          </h1>

          <div className="flex flex-1 items-center justify-center">
            <Image src={NoData} alt="No data" width={200} height={200} />
          </div>
        </div>
      </section>
    )
  }

  const libraryItems = await getRelatedLibraryItemsByAuthor({
    authorId: libraryItem.authors[0].authorId,
    pageIndex: 1,
    pageSize: "5",
    search: "",
  })

  const otherBooks = libraryItems.sources.filter(
    (item) => item.libraryItemId !== libraryItem.libraryItemId
  )

  return (
    <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden rounded-md border bg-card p-4 px-6 shadow-lg">
      <div className="px-4">
        <h1 className="text-xl font-semibold capitalize">
          <span className="text-primary">{t("about")}</span>&nbsp;
          {t("fields.author")}
        </h1>
        <Carousel
          opts={{
            loop: true,
            align: "center",
            duration: 20,
          }}
        >
          <CarouselContent>
            {libraryItem.authors.map((author) => {
              return (
                <CarouselItem key={author.authorId}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h1 className="flex items-center gap-2">
                        <User size={18} />
                        {author?.fullName}
                      </h1>

                      {author?.dob && (
                        <div className="flex items-center gap-2 text-sm">
                          <Cake size={18} />
                          {author.dob
                            ? new Date(author?.dob).toDateString()
                            : "N/A"}
                        </div>
                      )}

                      {author?.nationality && (
                        <div className="flex items-center gap-2">
                          <Earth size={18} /> {author.nationality}
                        </div>
                      )}
                    </div>

                    {libraryItem?.authors[0]?.authorImage && (
                      <Image
                        key={author.authorId}
                        src={author.authorImage || ""}
                        alt="Author"
                        width={100}
                        height={120}
                        className="rounded-md object-cover"
                      />
                    )}
                  </div>
                  <StyledReadMore>
                    {libraryItem.authors[0]?.biography}
                  </StyledReadMore>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          {libraryItem.authors.length > 1 && (
            <CarouselPrevious className="ml-4 size-4" />
          )}
          {libraryItem.authors.length > 1 && (
            <CarouselNext className="mr-4 size-4" />
          )}
        </Carousel>
      </div>

      {otherBooks.length > 0 && (
        <div className="px-4">
          <h1 className="mt-4 text-xl font-semibold">{t("other books")}</h1>
          <div className="flex flex-1 items-center justify-center">
            <Carousel
              opts={{ loop: false, slidesToScroll: 2 }}
              className="w-full"
            >
              <CarouselContent className="space-x-2">
                {libraryItems.sources.map((item) => {
                  if (item.libraryItemId !== libraryItem.libraryItemId) {
                    return (
                      <CarouselItem
                        key={item.libraryItemId}
                        className="h-full shrink-0 basis-1/4"
                      >
                        <Link
                          href={`/books/${item.libraryItemId}`}
                          className="flex items-center justify-center overflow-hidden rounded-md shadow-lg"
                        >
                          <div className="relative aspect-[2/3] size-full overflow-hidden rounded-t-lg">
                            <Image
                              src={item.coverImage || ""}
                              alt="Logo"
                              fill
                              className="object-fill duration-150 ease-in-out hover:scale-105"
                            />
                          </div>
                        </Link>
                      </CarouselItem>
                    )
                  }
                })}
              </CarouselContent>

              <CarouselPrevious className="ml-4 size-4" />
              <CarouselNext className="mr-4 size-4" />
            </Carousel>
          </div>
        </div>
      )}
    </section>
  )
}

export default BookAuthorCard
