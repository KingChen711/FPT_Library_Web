import { getTranslations } from "@/lib/get-translations"

import BannerHome from "./_components/banner"
import BookList from "./_components/book-list"

export default async function Home() {
  const t = await getTranslations("HomePage")
  return (
    <div className="grid w-full gap-4">
      <BannerHome />
      <h1 className="mt-8 text-center text-2xl font-semibold text-primary">
        {t("welcome")}
      </h1>
      <BookList title="Best seller" totalBooks={120} />
      <BookList title="Recommend for You" totalBooks={12} />
      <BookList title="Recent Reading" totalBooks={40} />
      <BookList title="Academic Book" totalBooks={24} />
      <BookList title="News" totalBooks={17} />
      <BookList title="Children Book" totalBooks={10} />
    </div>
  )
}
