import React from "react"
import { Link } from "@/i18n/routing"
import { SquarePen } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const BookOverviewTab = () => {
  return (
    <div>
      <section className="flex items-center gap-4">
        <div className="flex-1 rounded-lg border bg-primary-foreground p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Publish Year</p>
          <p>2000</p>
        </div>
        <div className="flex-1 rounded-lg border bg-primary-foreground p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Publisher</p>
          <p className="text-sm text-danger">New Riders Press</p>
        </div>
        <div className="flex-1 rounded-lg border bg-primary-foreground p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Language</p>
          <p className="text-sm text-danger">English</p>
        </div>
        <div className="flex-1 rounded-lg border bg-primary-foreground p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Pages</p>
          <p className="text-sm text-danger">216</p>
        </div>
      </section>

      <section className="space-y-4 text-sm">
        <p className="mt-4 text-sm font-semibold">
          Preview available in &nbsp;
          <span className="font-semibold text-primary underline">English</span>
        </p>
        <div>
          <p className="line-clamp-3 text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
            dolor qui fugiat optio sapiente reiciendis nihil atque vitae. Sint
            debitis perspiciatis nam, at unde tempora! Porro eaque tenetur
            repudiandae dicta possimus est voluptatem enim sunt explicabo. Nemo,
            voluptate? Quas, porro quisquam similique explicabo sint, esse,
            corrupti in vel ratione molestias aspernatur quia aliquam
            reprehenderit aperiam quidem beatae iste fuga cum itaque eius
            officia mollitia. Nulla enim atque provident officiis ut ullam ipsa
            eum, impedit a unde exercitationem blanditiis beatae officia.
          </p>
          <p className="cursor-pointer text-right font-semibold text-danger underline">
            Read More
          </p>
        </div>

        <div className="flex gap-4">
          <section className="flex-1 space-y-4 rounded-lg border bg-primary-foreground p-4 shadow-md">
            <h1 className="text-xl font-bold text-primary">Book Details</h1>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Published in</p>
              <p className="flex-1">United States</p>
            </div>

            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                Edition Notes
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Series</p>
                <p className="flex-1">Dover large print classics</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Genre</p>
                <p className="flex-1">Fiction</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                Classifications
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Dewey Decimal Class</p>
                <p className="flex-1">823/.8</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Library of Congress</p>
                <p className="flex-1">PR5485 .A1 2002</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                The physical object
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Pagination</p>
                <p className="flex-1">ix, 112 p. (large print)</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Number of pages</p>
                <p className="flex-1">216</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">ID Numbers</h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">My Book Shelf</p>
                <p className="flex-1">OL3570252M</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">ISBN 10</p>
                <p className="flex-1">0486424715</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">LCCN</p>
                <p className="flex-1">2002073560</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Library Thing</p>
                <p className="flex-1">12349</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Good reads</p>
                <p className="flex-1">690668</p>
              </div>
            </section>
          </section>

          <section className="h-fit flex-1 space-y-4 rounded-lg border bg-primary-foreground p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">
                Community Reviews
              </h1>
              <Link
                href="#"
                className="cursor-pointer font-semibold text-danger underline"
              >
                Feedbacks
              </Link>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Page</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Meandering 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Enjoy ability</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Interesting 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Difficulty</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Advanced 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Genre</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Horror 66%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Mystery 33%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Mood</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Ominous 25%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Scientific 25%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Impressions</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Overheaped 50%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Forgettable 50%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Length</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Short 100%
              </Badge>
            </div>

            {/* Add user's review */}
            <div className="mt-16 flex justify-end">
              <Link
                href="#"
                className="flex items-center gap-2 text-right font-semibold text-danger underline"
              >
                <SquarePen size={16} /> Add your community review
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default BookOverviewTab
