import React from "react"
import { pdfjsVersion } from "@/constants"

import FlipBook from "./flip-book"

const Ebook = () => {
  console.log("🚀 ~ pdfjsVersion:", pdfjsVersion)

  return (
    <div>
      <h1>Ebook {pdfjsVersion}</h1>
      <FlipBook pdfUrl="https://file.nhasachmienphi.com/pdf/nhasachmienphi-206-mon-canh-dinh-duong-cho-tre-em.pdf" />
      <FlipBook pdfUrl="/assets/files/test.pdf" />
      {/* <FlipBook pdfUrl="/files/test.pdf" /> */}
    </div>
  )
}

export default Ebook
