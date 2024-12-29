import Image from "next/image"
import { Link } from "@/i18n/routing"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

import { dummyBooks } from "./dummy-books"

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
        {dummyBooks.map((item) => (
          <Card
            key={item.id}
            className="flex h-[380px] flex-col justify-between overflow-hidden bg-primary-foreground"
          >
            <div className="flex h-3/4 items-center justify-center overflow-hidden">
              <Image
                src={item.image}
                alt="Logo"
                width={300}
                height={400}
                className="rounded-t-lg object-cover duration-150 ease-in-out hover:scale-105"
              />
            </div>
            <div className="overflow-hidden p-4">
              <Link
                href={`#`}
                className="truncate text-lg font-semibold hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="text-sm italic">by {item.author}</p>
              <p className="flex items-center gap-2 font-semibold">
                <Icons.Star className="size-4 text-yellow-500" /> 4.5 / 5
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BookList
