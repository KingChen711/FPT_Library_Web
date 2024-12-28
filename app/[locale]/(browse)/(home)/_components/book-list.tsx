import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"

import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

type Props = {
  title: string
  totalBooks: number
}

const BookList = ({ title, totalBooks }: Props) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between font-semibold">
        <Label className="text-xl text-primary">
          {title} <span className="text-primary">({totalBooks} books)</span>
        </Label>
        <Link href={`#`} className="text-primary underline hover:opacity-80">
          Show all
        </Link>
      </div>
      <div className="mt-4 grid w-full gap-8 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="flex h-[420px] flex-col justify-between overflow-hidden bg-primary-foreground"
          >
            <div className="overflow-hidden">
              <Image
                src="https://upload.wikimedia.org/wikibooks/vi/a/a6/B%C3%ACa_s%C3%A1ch_Harry_Potter_ph%E1%BA%A7n_6.jpg"
                priority
                alt="Logo"
                width={300}
                height={400}
                className="rounded-t-lg object-cover duration-150 ease-in-out hover:scale-105"
              />
            </div>
            <CardContent className="mt-4">
              <Link
                href={`#`}
                className="truncate text-lg font-semibold hover:text-primary"
              >
                Harry Potter
              </Link>
              <p className="text-sm italic">by J. K. Rowling, 2005</p>
              <p className="flex items-center gap-2 font-semibold">
                <Icons.Star className="size-4 text-yellow-500" /> 4.5 / 5
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BookList
