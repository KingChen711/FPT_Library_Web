import React from "react"
import Image from "next/image"
import { CheckCircle2, CircleX } from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { dummyBooks } from "../../../_components/dummy-books"

type Props = {
  detectedBookId: string
  comparedBookId: string
}

const RecommendBookPreview = ({ detectedBookId, comparedBookId }: Props) => {
  const detectedBook = dummyBooks.find(
    (book) => book.id.toString() === detectedBookId
  )
  const comparedBook = dummyBooks.find(
    (book) => book.id.toString() === comparedBookId
  )

  if (!detectedBook || !comparedBook) {
    return <div>Book not found</div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px] border"></TableHead>
            <TableHead className="border">
              <div className="flex items-center justify-center">
                <Image
                  src={detectedBook.image}
                  alt={detectedBook.title}
                  width={150}
                  height={200}
                  className="object-contain"
                />
              </div>
            </TableHead>
            <TableHead className="border">
              <div className="flex items-center justify-center">
                <Image
                  src={comparedBook.image}
                  alt={comparedBook.title}
                  width={150}
                  height={200}
                  className="object-contain"
                />
              </div>
            </TableHead>
            <TableHead className="border" />
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableRow className="bg-draft">
            <TableHead className="w-[140px]"></TableHead>
            <TableHead className="font-semibold text-primary-foreground">
              Detected book
            </TableHead>
            <TableHead className="font-semibold text-primary-foreground">
              Compared book
            </TableHead>
            <TableHead className="font-semibold text-primary-foreground">
              Match
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Title
            </TableCell>
            <TableCell className="border font-semibold">
              {detectedBook?.title}
            </TableCell>
            <TableCell className="border font-semibold">
              {comparedBook?.title}
            </TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Author
            </TableCell>
            <TableCell className="border">{detectedBook?.author}</TableCell>
            <TableCell className="border">{comparedBook?.author}</TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Publisher
            </TableCell>
            <TableCell className="border">Nhà xuất bản trẻ</TableCell>
            <TableCell className="border">Nhà xuất bản trẻ</TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Genres
            </TableCell>
            <TableCell className="border">Truyền thuyết, phép thuật</TableCell>
            <TableCell className="border">Truyền thuyết, phép thuật</TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Topical Terms
            </TableCell>
            <TableCell className="border">Văn học hiện đại, suy luận</TableCell>
            <TableCell className="border">Văn học hiện đại, suy luận</TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              DDC
            </TableCell>
            <TableCell className="border">823</TableCell>
            <TableCell className="border">900</TableCell>
            <TableCell className="border">
              <CheckCircle2 size={24} color="white" fill="#42bb4e" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-primary font-semibold text-primary-foreground">
              Cutter number
            </TableCell>
            <TableCell className="border">H418B</TableCell>
            <TableCell className="border">HNS12</TableCell>
            <TableCell className="border">
              <CircleX size={16} color="white" fill="red" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default RecommendBookPreview
