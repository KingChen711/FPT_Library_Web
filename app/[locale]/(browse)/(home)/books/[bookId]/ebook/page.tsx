"use client"

import { useSearchParams } from "next/navigation"

import BookAudio from "../_components/book-audio"

type Props = {
  params: {
    bookId: string
  }
}

const EbookPage = ({ params }: Props) => {
  const searchParams = useSearchParams()
  const isAudio = searchParams.get("audio")

  return (
    <div className="flex h-full flex-col bg-secondary">
      <div className="flex-1">
        <iframe
          className="m-0 size-full"
          src="https://file.nhasachmienphi.com/pdf/nhasachmienphi-206-mon-canh-dinh-duong-cho-tre-em.pdf"
        />
      </div>
      {isAudio === "true" && <BookAudio bookId={params.bookId} />}
    </div>
  )
}

export default EbookPage
