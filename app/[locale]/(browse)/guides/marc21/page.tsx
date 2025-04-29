import React from "react"
import Link from "next/link"

import { getTranslations } from "@/lib/get-translations"

async function Marc21Guide() {
  const t = await getTranslations("GuideMarc21")
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto grow pb-8">
        <h1 className="mb-6 text-3xl font-bold">{t("Title")}</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("What is copy catalog")}
          </h2>
          <p className="mb-4">{t("copy catalog defi")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("What is marc21")}</h2>
          <p className="mb-4">{t("marc21 defi")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("progress catalog")}
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              {t("progress catalog 1")}

              <ul className="ml-6 mt-2 list-inside list-disc space-y-1">
                <li>
                  <Link
                    target="_blank"
                    href="https://catalog.loc.gov"
                    className="font-bold text-primary hover:underline"
                  >
                    Library of Congress
                  </Link>{" "}
                  - {t("progress resource 1")}
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://www.worldcat.org"
                    className="font-bold text-primary hover:underline"
                  >
                    WorldCat
                  </Link>{" "}
                  - {t("progress resource 2")}
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="http://opac.nlv.gov.vn"
                    className="font-bold text-primary hover:underline"
                  >
                    {t("progress resource 3")}
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://www.bnf.fr/en"
                    className="font-bold text-primary hover:underline"
                  >
                    Bibliothèque nationale de France
                  </Link>{" "}
                  - {t("progress resource 4")}
                </li>
              </ul>
            </li>
            <li>{t("progress catalog 2")}</li>
            <li>{t("progress catalog 3")}</li>
            <li>{t("progress catalog 4")}</li>
            <li>{t("progress catalog 5")}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("MARC21 sample")}</h2>
          <pre className="overflow-x-auto rounded-md bg-muted p-4">
            <code className="!text-muted-foreground">
              {`020	#	#	a	978-604-1-24395-8
            c	170000đ
            d	2000b
041	1	#	a	vie
            h	eng
082	0	4	2	23
            a	823
            b	H109P
100	1	#	a	Rowling, J. K.
245	1	0	a	Harry Potter và phòng chứa bí mật
            b	= Harry Potter and the chamber of secrets
            c	J. K. Rowling ; Lý Lan dịch
250	#	#	a	In lần thứ 56
260	#	#	a	Tp. Hồ Chí Minh
            b	Nxb. Trẻ
            c	2024
300	#	#	a	429 tr.
            c	20 cm
490	0	#	a	Harry Potter
            v	T.2
650	#	7	2	Bộ TK TVQG
            a	Văn học thiếu nhi
651	#	7	2	Bộ TK TVQG
            a	Anh
655	#	7	2	Bộ TK TVQG
            a	Tiểu thuyết
700	1	#	a	Lý Lan
            e	dịch
920	#	#	a	Rowling, J. K.
930	#	#	a	572002
941	#	#	a	DP
            b	VH
            c	Dịch Anh`}
            </code>
          </pre>
          <p className="mt-4">{t("sample note")}</p>
        </section>
      </main>
    </div>
  )
}

export default Marc21Guide
