import Image from "next/image"
import { Link } from "@/i18n/routing"
import {
  BookOpen,
  Cake,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Headphones,
  MapPin,
  Notebook,
  NotebookPen,
  Plus,
  Share,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { StyledReadMore } from "@/components/ui/read-more"

import { dummyBooks } from "../../_components/dummy-books"
import BookBorrowDialog from "./_components/book-borrow-dialog"
import BookTabs from "./_components/book-tabs"

type Props = {
  params: {
    bookId: string
  }
}

const BookDetailPage = ({ params: { bookId } }: Props) => {
  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  if (!book) {
    return <div>Book not found</div>
  }

  return (
    <div className="size-full space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{book.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex h-full gap-4">
        {/* Picture */}
        <section className="h-full w-1/4">
          <div className="flex h-[56vh] flex-col justify-between overflow-hidden rounded-lg bg-primary-foreground shadow-lg">
            <div className="flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-t-lg p-4">
              <Image
                src={book?.image}
                alt="Logo"
                width={200}
                height={250}
                className="object-contain duration-150 ease-in-out hover:scale-105"
              />
            </div>
            <div className="flex border-t-2 py-4">
              <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
                <NotebookPen size={16} /> Review
              </div>
              <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 border-x-2 hover:text-primary">
                <Notebook size={16} /> Note
              </div>
              <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
                <Share size={16} /> Share
              </div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="h-full flex-1 space-y-4">
          <div className="flex h-[56vh] gap-4">
            {/* Info */}
            <div className="flex w-3/5 flex-col justify-between rounded-lg bg-primary-foreground p-4 shadow-lg">
              <div className="space-y-2">
                <p className="font-thin italic">
                  An edition of {book.title} (2024)
                </p>
                <h1 className="line-clamp-1 text-3xl font-semibold text-primary">
                  {book?.title}
                </h1>
                <p className="text-lg">
                  Lorem ipsum dolor sit amet adipisicing elit.
                </p>
                <p className="text-sm italic">by {book?.author}, 2000</p>
                <Badge variant={"secondary"} className="w-fit">
                  Second Edition
                </Badge>
                <div className="flex justify-between text-sm">
                  <div>⭐⭐⭐⭐⭐ 5/5 Ratings</div>
                  <div>
                    <span className="font-semibold">25</span> Reading
                  </div>
                  <div>
                    <span className="font-semibold">119</span> Have read
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  {/* Availability */}
                  <div>
                    <h1 className="font-semibold">Availability</h1>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                        Hard copy
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                        E-book
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleX size={16} color="white" fill="#868d87" /> Audio
                        book
                      </div>
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <h1 className="font-semibold">Status</h1>
                    <div className="mt-2 space-y-2">
                      <Badge className="h-full w-fit bg-success hover:bg-success">
                        Available
                      </Badge>
                      <div className="flex items-center">
                        <MapPin color="white" fill="orange" /> CS A-15
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Plus /> Add to favorite
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <BookBorrowDialog />

                <Button asChild variant={"destructive"}>
                  <Link href={`/books/${book.id}/ebook`}>
                    <Headphones /> Audio
                  </Link>
                </Button>

                <Button asChild variant={"destructive"}>
                  <Link href={`/books/${book.id}/ebook`}>
                    <BookOpen /> Read now
                  </Link>
                </Button>
              </div>
            </div>
            {/* Author */}
            <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto rounded-lg bg-primary-foreground p-4 shadow-lg">
              <div>
                <h1 className="text-xl font-semibold capitalize">
                  <span className="text-primary">About</span> Author
                </h1>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="flex items-center gap-2">
                      <User size={18} /> {book?.author}
                    </h1>
                    <div className="flex items-center gap-2 text-sm">
                      <Cake size={18} /> July 31, 1965
                    </div>
                  </div>
                  <Image
                    alt="Author"
                    src="https://files.bestbooks.to/625e6d9b-dd99-4f83-8ce0-d361bcde9642.jpg"
                    width={100}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </div>
                <StyledReadMore truncate={80}>
                  The author is renowned for captivating storytelling and has a
                  profound impact on contemporary literature with numerous
                  acclaimed works. The author writing style is characterized by
                  vivid imagery, well-developed characters, and a deep emotional
                  resonance. The author works often explore themes of social
                  justice, personal identity, and the human condition, and are
                  widely regarded as some of the most important and influential
                  of the past century.
                </StyledReadMore>
              </div>
              <div className="mt-auto">
                <h1 className="mt-4 text-xl font-semibold">Other Books</h1>
                <div className="mt-2 flex gap-4 overflow-x-auto">
                  {dummyBooks.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex h-20 w-16 shrink-0 items-center overflow-hidden rounded-lg"
                    >
                      <Image
                        src={item.image}
                        alt="Logo"
                        fill
                        className="object-cover duration-150 ease-in-out hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <BookTabs />
        </section>
      </div>
    </div>
  )
}

export default BookDetailPage
