import Image from "next/image"
import { CheckCircle2, CircleX, MapPin, Plus } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { dummyBooks } from "../../../_components/dummy-books"

const PredictionResultTab = async () => {
  const book = dummyBooks[0]
  const t = await getTranslations("BookPage")

  if (!book) {
    return <div>{t("Book not found")}</div>
  }
  return (
    <Card className="flex w-full gap-4 rounded-lg border-2 p-4">
      <section className="w-1/4">
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex justify-center">
            <Image src={book.image} alt={book.title} width={300} height={400} />
          </div>
          <Button className="flex w-full items-center gap-2">
            <MapPin size={24} /> Locate
          </Button>
        </div>
      </section>

      <section className="flex flex-1 flex-col justify-between rounded-lg p-4 shadow-lg">
        <div className="space-y-2">
          <p className="font-thin italic">
            {t("an edition of")} &nbsp;
            <span className="font-semibold">{book.title}</span> (2024)
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
            <div>⭐⭐⭐⭐⭐ 5/5 {t("fields.ratings")}</div>
            <div>
              <span className="font-semibold">25</span> {t("fields.reading")}
            </div>
            <div>
              <span className="font-semibold">119</span> {t("fields.have read")}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            {/* Availability */}
            <div>
              <h1 className="font-semibold">{t("fields.availability")}</h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                  {t("fields.hard copy")}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                  {t("fields.ebook")}
                </div>
                <div className="flex items-center gap-2">
                  <CircleX size={16} color="white" fill="#868d87" />
                  {t("fields.audio book")}
                </div>
              </div>
            </div>
            {/* Status */}
            <div>
              <h1 className="font-semibold"> {t("fields.status")}</h1>
              <div className="mt-2 space-y-2">
                <Badge className="h-full w-fit bg-success hover:bg-success">
                  {t("fields.availability")}
                </Badge>
                <div className="flex items-center">
                  <MapPin color="white" fill="orange" /> CS A-15
                </div>
              </div>
            </div>
            <Button>
              <Plus /> {t("add to favorite")}
            </Button>
          </div>
        </div>
      </section>

      <section className="w-1/4 space-y-4 rounded-lg border p-4 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-primary">
          AI-detected
        </h1>
        {/* Title prediction */}
        <div className="flex items-center gap-2">
          <div className="w-1/4 font-semibold">Title:</div>
          <div className="w-1/4 text-center">90%</div>
          <div className="flex-1">
            <Badge
              variant={"success"}
              className="flex w-full items-center justify-center text-center"
            >
              Passed
            </Badge>
          </div>
        </div>
        {/* Author prediction */}
        <div className="flex items-center gap-2">
          <div className="w-1/4 font-semibold">Author:</div>
          <div className="w-1/4 text-center">10%</div>
          <div className="flex-1">
            <Badge
              variant={"destructive"}
              className="flex w-full items-center justify-center text-center"
            >
              Not passed
            </Badge>
          </div>
        </div>
        {/* Publisher prediction */}
        <div className="flex items-center gap-2">
          <div className="w-1/4 font-semibold">Publisher:</div>
          <div className="w-1/4 text-center">98%</div>
          <div className="flex-1">
            <Badge
              variant={"success"}
              className="flex w-full flex-nowrap items-center justify-center text-nowrap text-center"
            >
              Passed
            </Badge>
          </div>
        </div>
        <Separator className="h-1" />

        <div className="space-y-2">
          <div className="flex">
            <div className="flex-1">Threshold value:</div>
            <div className="flex-1 text-center font-semibold text-danger">
              60%
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">Match overall:</div>
            <div className="flex-1 text-center font-semibold text-danger">
              90%
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">Status:</div>
            <div className="flex-1">
              <Badge
                variant={"success"}
                className="flex w-full flex-nowrap items-center justify-center text-nowrap text-center"
              >
                Passed
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </Card>
  )
}

export default PredictionResultTab
