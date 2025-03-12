"use client"

import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { LocalStorageKeys } from "@/constants"
import { Book, Filter, Search } from "lucide-react"
import { useLocale } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { localStorageHandler } from "@/lib/utils"
import { borrowLibraryItems } from "@/actions/library-item/borrow-library-items"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { dummyBooks } from "../_components/dummy-books"

interface BookType {
  id: string
  title: string
  subtitle: string
  author: string
  publisher: string
  publishedYear: number
  price: number
  isbn: string
  category: string
  language: string
  pages: number
  coverImage: string
  inStock: boolean
}

export default function FavoriteBooksPage() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  // Sample book data
  const [books] = useState<BookType[]>([
    {
      id: "1",
      title: "The Great Gatsby",
      subtitle: "A Portrait of the Jazz Age",
      author: "F. Scott Fitzgerald",
      publisher: "Scribner",
      publishedYear: 1925,
      price: 12.99,
      isbn: "978-0743273565",
      category: "Fiction",
      language: "English",
      pages: 180,
      coverImage: "/placeholder.svg?height=120&width=80",
      inStock: true,
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      subtitle: "A Story of Justice and Innocence",
      author: "Harper Lee",
      publisher: "HarperCollins",
      publishedYear: 1960,
      price: 14.99,
      isbn: "978-0061120084",
      category: "Fiction",
      language: "English",
      pages: 336,
      coverImage: "/placeholder.svg?height=120&width=80",
      inStock: true,
    },
    {
      id: "3",
      title: "1984",
      subtitle: "A Dystopian Social Science Fiction",
      author: "George Orwell",
      publisher: "Penguin Books",
      publishedYear: 1949,
      price: 11.99,
      isbn: "978-0451524935",
      category: "Science Fiction",
      language: "English",
      pages: 328,
      coverImage: "/placeholder.svg?height=120&width=80",
      inStock: false,
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      subtitle: "A Romantic Novel",
      author: "Jane Austen",
      publisher: "Penguin Classics",
      publishedYear: 1813,
      price: 9.99,
      isbn: "978-0141439518",
      category: "Romance",
      language: "English",
      pages: 432,
      coverImage: "/placeholder.svg?height=120&width=80",
      inStock: true,
    },
    {
      id: "5",
      title: "The Hobbit",
      subtitle: "There and Back Again",
      author: "J.R.R. Tolkien",
      publisher: "Houghton Mifflin",
      publishedYear: 1937,
      price: 13.99,
      isbn: "978-0547928227",
      category: "Fantasy",
      language: "English",
      pages: 304,
      coverImage: "/placeholder.svg?height=120&width=80",
      inStock: true,
    },
  ])

  const [borrowIdList, setBorrowIdList] = useState<string[]>([])

  // State for selected books
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])

  // Toggle all books selection
  const toggleAllBooks = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(books.map((book) => book.id))
    }
  }

  const updateBorrows = () => {
    setBorrowIdList(localStorageHandler.getItem(LocalStorageKeys.BORROW))
  }

  useEffect(() => {
    updateBorrows()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKeys.BORROW) {
        updateBorrows()
      }
    }
    const handleCustomEvent = () => updateBorrows()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(LocalStorageKeys.BORROW, handleCustomEvent)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(LocalStorageKeys.BORROW, handleCustomEvent)
    }
  }, [])

  // Toggle single book selection
  const toggleBookSelection = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId))
    } else {
      setSelectedBooks([...selectedBooks, bookId])
    }
  }

  // Check if all books are selected
  const allBooksSelected =
    selectedBooks.length === books.length && books.length > 0

  const handleSubmitBorrow = () => {
    startTransition(async () => {
      // updateBorrows()
      const res = await borrowLibraryItems({
        description: null,
        libraryItemIds: borrowIdList.map((id) => Number(id)),
      })
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Book className="size-6" />
          <h1 className="text-2xl font-bold">Favorite Books</h1>
          <Badge className="ml-2">{books.length} books</Badge>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="w-full pl-8"
            />
          </div>

          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="size-4" />
            <span className="sr-only">Filter</span>
          </Button>

          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {borrowIdList.length > 0 && (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => handleSubmitBorrow()}
          >
            Borrow
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center border-b p-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allBooksSelected}
                onCheckedChange={toggleAllBooks}
              />
              <label
                htmlFor="select-all"
                className="cursor-pointer text-sm font-medium"
              >
                Select All
              </label>
            </div>

            {borrowIdList.length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {borrowIdList.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Remove from favorites
                </Button>
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-[120px]"></TableHead>
                <TableHead>Book Details</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBooks.includes(book.id)}
                      onCheckedChange={() => toggleBookSelection(book.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      width={100}
                      height={150}
                      src={
                        dummyBooks[index % dummyBooks.length].image ||
                        "/placeholder.svg"
                      }
                      alt={book.title}
                      className="rounded border object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {book.subtitle}
                      </div>
                      <div className="text-sm">By {book.author}</div>
                      <div className="text-xs text-muted-foreground">
                        ISBN: {book.isbn} • {book.pages} pages • {book.language}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {book.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{book.publisher}</div>
                      <div className="text-sm text-muted-foreground">
                        {book.publishedYear}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${book.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {book.inStock ? (
                      <Badge className="border-green-200 bg-green-50 text-green-700">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge className="border-red-200 bg-red-50 text-red-700">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
