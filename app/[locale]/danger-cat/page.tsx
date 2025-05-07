import React from "react"
import Image from "next/image"
import Link from "next/link"
import dangerCat from "@/public/images/danger-cat.jpg"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

async function DangerCatPage() {
  const t = await getTranslations("BookPage")
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black text-white">
      <Image
        alt="danger-cat"
        src={dangerCat}
        height={500}
        width={500}
        className="aspect-square object-cover"
      />
      <div className="text-2xl font-bold">
        {t("Warning Do not attempt to steal resources")}
      </div>
      <Button asChild variant="secondary">
        <Link href="/">{t("Back to Home Page")}</Link>
      </Button>
    </div>
  )
}

export default DangerCatPage
