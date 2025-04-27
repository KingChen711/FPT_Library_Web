import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
// import NoResultImageVi from "@/public/images/no-result-vi.png"
import NoResultImage from "@/public/images/no-result.png"

import { Button } from "../ui/button"

type Props = {
  title: string
  description: string
  link?: string
  linkTitle?: string
}

function NoResult({ title, description, link, linkTitle }: Props) {
  return (
    <div className="mt-8 flex w-full flex-col items-center justify-center overflow-hidden">
      <Image
        src={NoResultImage}
        alt="no result"
        width={305}
        height={264}
        placeholder="blur"
        priority
        className="block rounded-md object-contain"
      />

      <h2 className="mt-8 text-[24px] font-bold leading-[31.2px]">{title}</h2>
      <p className="my-3 max-w-md text-center text-[14px] font-normal leading-[19.6px] text-muted-foreground">
        {description}
      </p>
      {link && (
        <Link href={link}>
          <Button className="mt-5 min-h-[46px] rounded-md bg-primary px-4 py-3 text-[16px] font-medium leading-[22.4px] hover:bg-primary">
            {linkTitle}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default NoResult
