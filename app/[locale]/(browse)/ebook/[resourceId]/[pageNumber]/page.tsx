import React from "react"
import { notFound } from "next/navigation"
import { z } from "zod"

type Props = {
  params: {
    resourceId: string
    pageNumber: string
  }
}

const ebookPageParamsSchema = z.object({
  resourceId: z.coerce.number().min(1).catch(0),
  pageNumber: z.coerce.number().min(1).catch(0),
})

function EbookPage({ params }: Props) {
  const { pageNumber, resourceId } = ebookPageParamsSchema.parse(params)

  if (!pageNumber || !resourceId) notFound()

  return <div>EbookPage</div>
}

export default EbookPage
