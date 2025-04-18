import searchBooksAdvance from "@/queries/books/search-books-advance"

import { getTranslations } from "@/lib/get-translations"
import { searchBooksAdvanceSchema } from "@/lib/validations/books/search-books-advance"
import LibraryItemCard from "@/components/ui/book-card"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const SearchResult = async ({ searchParams }: Props) => {
  const { sort, pageIndex, ...rest } = searchBooksAdvanceSchema.parse({
    ...searchParams,
    searchWithKeyword: searchParams.searchWithKeyword
      ? +searchParams.searchWithKeyword
      : undefined,
  })
  const t = await getTranslations("BookPage")
  const tNoResult = await getTranslations("BooksManagementPage")
  const { libraryItems, pageSize, totalActualResponse, totalPage } =
    await searchBooksAdvance({ sort, pageIndex, ...rest })

  return (
    <div className="flex size-full flex-col gap-4 overflow-y-auto">
      <h3 className="text-2xl font-semibold">{t("Search results")}</h3>

      {libraryItems.length > 0 ? (
        <section className="space-y-6">
          {libraryItems.map((item) => (
            <LibraryItemCard
              canOpen
              fetchShelf
              key={item.libraryItemId}
              libraryItem={item}
              className="max-w-full"
            />
          ))}

          <Paginator
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalActualItem={totalActualResponse}
            totalPage={totalPage}
          />
        </section>
      ) : (
        <NoResult
          title={tNoResult("Library Items Not Found")}
          description={tNoResult(
            "No library items matching your request were found Please check your information or try searching with different criteria"
          )}
        />
      )}
    </div>
  )
}

export default SearchResult
