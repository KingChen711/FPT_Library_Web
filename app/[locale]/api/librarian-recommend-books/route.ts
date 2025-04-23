/* eslint-disable @typescript-eslint/ban-ts-comment */

import { GoogleGenerativeAI } from "@google/generative-ai"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

import { type StockRecommendedBook } from "@/lib/types/models"
import translateText from "@/hooks/utils/translate"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

type TGoogleBook = {
  selfLink?: string
  volumeInfo: {
    title: string
    subtitle?: string
    authors?: string[]
    author?: string
    publisher?: string
    publishedDate?: string
    description?: string
    industryIdentifiers?: [{ type?: string; identifier?: string }]
    pageCount?: number
    averageRating?: number
    ratingsCount?: number
    categories?: string[]
    language?: string
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
      small?: string
      medium?: string
      large?: string
      extraLarge?: string
    }
    previewLink?: string
    infoLink?: string
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  const relatedTitle = body?.relatedTitle as string | undefined
  const relatedLibraryItemId = body?.relatedLibraryItemId as string | undefined

  if (!relatedTitle || !relatedLibraryItemId || !Number(relatedLibraryItemId))
    return Response.json("Missing relatedTitle or relatedLibraryItemId", {
      status: 400,
    })

  try {
    const newMessage = {
      role: "user",
      parts: [] as { text: string }[],
    }

    if (relatedTitle) {
      newMessage.parts.push({
        text: `Based on the title '${relatedTitle}', which is a user's last read book, suggest a maximum of 5 book titles that this user may like, excluding any of the user's last read books. If the book title provided is in Vietnamese, then Vietnamese books should be recommended. Do not suggest specific episode numbers in the results if the title I provide includes episode numbers. Since your output will be used for further searching via the Google API, you should adjust the result titles to improve search effectiveness. Return the suggestions in the following JSON array format: [{"title": "The White Tiger"}, {"title": "A House For Mr. Biswas"}]. Provide only the JSON array as the response, with no additional text.`,
      })
    }

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    })

    const result = await chat.sendMessage(newMessage.parts)
    const response = result.response
    const text = response.text()

    const normalizedTitles = (
      JSON.parse(
        text
          .replaceAll("```json", "")
          .replaceAll("json", "")
          .replaceAll("```", "")
      ) as { title: string }[]
    ).map((item) => item.title.toLowerCase().trim())

    const books = (
      await Promise.all(
        normalizedTitles.map(async (normalizedTitle) => {
          const params = {
            q: `intitle:${normalizedTitle}`,
            langRestrict: "vi", // prioritize Vietnamese books
            printType: "books",
            maxResults: 3,
            orderBy: "relevance",
            key: process.env.GOOGLE_BOOKS_KEY, // Make sure to set your API key
          }

          try {
            const response = await axios.get(
              "https://www.googleapis.com/books/v1/volumes",
              { params }
            )

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const books = response.data.items.slice(0, 3) as TGoogleBook[]

            return (
              await Promise.all(
                books.map(async (book) => {
                  let googleBook
                  if (!book.selfLink) googleBook = book
                  else {
                    const response = await axios.get(book.selfLink)
                    googleBook = response.data as TGoogleBook
                  }

                  const translatedBook: StockRecommendedBook = {
                    id: uuidv4(),
                    title: googleBook.volumeInfo.title,
                    selfLink: googleBook.selfLink,
                    author:
                      googleBook.volumeInfo.author ||
                      (googleBook.volumeInfo.authors &&
                        googleBook.volumeInfo.authors.join(",")) ||
                      "",
                    publisher: googleBook.volumeInfo.publisher || "",
                    publishedDate: googleBook.volumeInfo.publishedDate,
                    description: googleBook.volumeInfo.description,
                    isbn:
                      googleBook.volumeInfo.industryIdentifiers &&
                      (
                        googleBook.volumeInfo.industryIdentifiers.find(
                          (i) => i.type === "ISBN_13"
                        ) ||
                        googleBook.volumeInfo.industryIdentifiers.find(
                          (i) => i.type === "ISBN_10"
                        )
                      )?.identifier,
                    pageCount: googleBook.volumeInfo.pageCount,
                    estimatedPrice: undefined,
                    dimensions: undefined,
                    categories:
                      googleBook.volumeInfo.categories &&
                      googleBook.volumeInfo.categories[0],
                    language: googleBook.volumeInfo.language,
                    averageRating: googleBook.volumeInfo.averageRating,
                    ratingsCount: googleBook.volumeInfo.ratingsCount,
                    coverImageLink:
                      googleBook.volumeInfo.imageLinks?.thumbnail ||
                      googleBook.volumeInfo.imageLinks?.extraLarge ||
                      googleBook.volumeInfo.imageLinks?.large ||
                      googleBook.volumeInfo.imageLinks?.medium ||
                      googleBook.volumeInfo.imageLinks?.small ||
                      googleBook.volumeInfo.imageLinks?.smallThumbnail,
                    previewLink: googleBook.volumeInfo.previewLink,
                    infoLink: googleBook.volumeInfo.infoLink,
                    relatedLibraryItemId: +relatedLibraryItemId,
                  }

                  if (
                    !translatedBook.author ||
                    !translatedBook.publisher ||
                    !translatedBook.pageCount
                  ) {
                    return false
                  }

                  await Promise.all(
                    Object.keys(translatedBook).map(async (key) => {
                      if (
                        !["description", "author", "categories"].includes(key)
                      )
                        return
                      if (
                        //@ts-ignore
                        typeof translatedBook[key] !== "string" ||
                        //@ts-ignore
                        translatedBook[key].startsWith("http")
                      )
                        return

                      //@ts-ignore
                      translatedBook[key] = await translateText(
                        //@ts-ignore
                        translatedBook[key]
                      )
                    })
                  )

                  return translatedBook
                })
              )
            ).filter(Boolean)
          } catch (error) {
            console.error("Failed to fetch books:", error)
            return []
          }
        })
      )
    ).flat()

    return Response.json({ normalizedTitles, response: books })
  } catch (error) {
    return Response.json(error, { status: 500 })
  }
}
