import { z } from "zod"

import { isbnSchema } from "./validations/isbn"

// const languageMapping: { [key: string]: string } = {
//   af: "Afrikaans",
//   am: "አማርኛ",
//   ar: "العربية",
//   az: "Azərbaycanca",
//   bg: "Български",
//   bn: "বাংলা",
//   bs: "Bosanski",
//   ca: "Català",
//   cs: "Čeština",
//   cy: "Cymraeg",
//   da: "Dansk",
//   de: "Deutsch",
//   el: "Ελληνικά",
//   en: "English",
//   es: "Español",
//   et: "Eesti",
//   fa: "فارسی",
//   fi: "Suomi",
//   fil: "Filipino",
//   fr: "Français",
//   ga: "Gaeilge",
//   gl: "Galego",
//   gu: "ગુજરાતી",
//   he: "עברית",
//   hi: "हिन्दी",
//   hr: "Hrvatski",
//   hu: "Magyar",
//   hy: "Հայերեն",
//   id: "Bahasa Indonesia",
//   is: "Íslenska",
//   it: "Italiano",
//   ja: "日本語",
//   ka: "ქართული",
//   kk: "Қазақ",
//   km: "ភាសាខ្មែរ",
//   kn: "ಕನ್ನಡ",
//   ko: "한국어",
//   ky: "Кыргызча",
//   lo: "ພາສາລາວ",
//   lt: "Lietuvių",
//   lv: "Latviešu",
//   mk: "Македонски",
//   ml: "മലയാളം",
//   mn: "Монгол",
//   mr: "मराठी",
//   ms: "Bahasa Melayu",
//   my: "ဗမာစာ",
//   ne: "नेपाली",
//   nl: "Nederlands",
//   no: "Norsk",
//   pa: "ਪੰਜਾਬੀ",
//   pl: "Polski",
//   ps: "پښتو",
//   pt: "Português",
//   ro: "Română",
//   ru: "Русский",
//   si: "සිංහල",
//   sk: "Slovenčina",
//   sl: "Slovenščina",
//   so: "Soomaali",
//   sq: "Shqip",
//   sr: "Српски",
//   sv: "Svenska",
//   sw: "Kiswahili",
//   ta: "தமிழ்",
//   te: "తెలుగు",
//   th: "ไทย",
//   tr: "Türkçe",
//   uk: "Українська",
//   ur: "اردو",
//   uz: "Oʻzbek (Uzbek)",
//   vi: "Tiếng Việt",
//   vie: "Tiếng Việt",
//   xh: "isiXhosa",
//   yi: "ייִדיש",
//   zh: "中文",
//   zu: "isiZulu",
// }

type Marc21Template = {
  [outputKey: string]: {
    tag: string
    subfield: string
    multiple?: boolean // true nếu muốn gom nhiều giá trị thành mảng
    transform?: (
      value: string
    ) => string | number | boolean | string[] | undefined // hàm để tùy chỉnh giá trị
  }
}

// Hàm chuyển đổi dữ liệu MARC21 thành JSON dựa trên template
function parseMarc21WithTemplate(
  marcData: string,
  template: Marc21Template
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  let lastTag = ""

  const lines = marcData
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      if (line.split("\t")[0].length !== 3) {
        return lastTag + "$" + line
      } else {
        lastTag = line.substring(0, 8)
      }

      return line.slice(0, 8) + "$" + line.slice(8)
    })

  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].startsWith("700\t1\t#\t$a") &&
      !lines[i + 1].startsWith("700\t1\t#\t$e")
    ) {
      lines.splice(++i, 0, "700\t1\t#\t$e\tnot mentioned")
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {}

  // Lặp qua từng dòng MARC21
  lines.forEach((line) => {
    const tag = line.substring(0, 3).trim()
    const rawSubfields = line.substring(7).trim()
    const subfields = parseSubfields(rawSubfields)

    // Lặp qua từng key trong template
    for (const [outputKey, mapping] of Object.entries(template)) {
      if (tag === mapping.tag) {
        const value = subfields[mapping.subfield] || ""

        if (value) {
          if (mapping.multiple) {
            result[outputKey] = result[outputKey] || []
            result[outputKey].push(
              mapping.transform ? mapping.transform(value) : value
            )
          } else {
            result[outputKey] = mapping.transform
              ? mapping.transform(value)
              : value
          }
        }
      }
    }
  })

  return result
}

// Hàm phân tích cú pháp các subfield
function parseSubfields(rawSubfields: string): { [code: string]: string } {
  const subfields: { [code: string]: string } = {}
  const matches = rawSubfields.match(/\$(\w)\s([^$]+)/g)

  if (matches) {
    matches.forEach((match) => {
      const code = match[1]
      const value = match.slice(2).trim()
      subfields[code] = value
    })
  }

  return subfields
}

// Template ánh xạ MARC21 -> JSON
const marcTemplate: Marc21Template = {
  isbn: { tag: "020", subfield: "a" },
  estimatedPrice: {
    tag: "020",
    subfield: "c",
    transform: (val: string) =>
      val ? +val.replace("đ", "").replace(",", ".").trim() : undefined,
  },
  language: {
    tag: "041",
    subfield: "a",
  },
  originLanguage: {
    tag: "041",
    subfield: "h",
  },
  ean: { tag: "024", subfield: "a" },
  classificationNumber: { tag: "082", subfield: "a" },
  cutterNumber: { tag: "082", subfield: "b" },
  author: { tag: "100", subfield: "a" },
  title: { tag: "245", subfield: "a" },
  subtitle: { tag: "245", subfield: "b" },
  responsibility: {
    tag: "245",
    subfield: "c",
    transform: (val: string) =>
      val.split(";").map((i) => i.replace("...", "").trim()),
  },
  edition: { tag: "250", subfield: "a" },
  // publisherLocation: {tag: "260", subfield: "a"},
  publicationPlace: { tag: "260", subfield: "a" },
  publisher: { tag: "260", subfield: "b" },
  publicationYear: {
    tag: "260",
    subfield: "c",
    transform: (value) => (value ? +value : undefined),
  },
  pageCount: {
    tag: "300",
    subfield: "a",
    transform: (value) =>
      value ? +value.replace("tr.", "").replace("tr", "").trim() : undefined,
  },
  physicalDetails: { tag: "300", subfield: "b" },
  dimensions: { tag: "300", subfield: "c" },
  accompanyingMaterial: { tag: "300", subfield: "e" },
  generalNote: { tag: "500", subfield: "a" },
  bibliographicalNote: { tag: "504", subfield: "a" },
  summary: { tag: "520", subfield: "a" },
  topicalTerms: { tag: "650", subfield: "a", multiple: true },
  keywords: { tag: "653", subfield: "a", multiple: true },
  genres: { tag: "655", subfield: "a", multiple: true },
  additionalAuthors: {
    tag: "700",
    subfield: "a",
    multiple: true,
  },
  additionalAuthorContributions: {
    tag: "700",
    subfield: "e",
    multiple: true,
  },
}

export const parsedMarc21 = (marc21Data: string) => {
  const jsonData = parseMarc21WithTemplate(marc21Data, marcTemplate)
  const parsedMarc = {
    ...jsonData,
    responsibility: jsonData.responsibility
      ? jsonData.responsibility.join(",")
      : undefined,
    additionalAuthors: jsonData.additionalAuthors
      ? jsonData.additionalAuthors
          .map((a: string, i: number) => {
            if (jsonData.additionalAuthorContributions[i] === "not mentioned") {
              return jsonData.additionalAuthors[i]
            }
            return (
              jsonData.additionalAuthors[i] +
              " - " +
              jsonData.additionalAuthorContributions[i]
            )
          })
          .join(",")
      : undefined,
    topicalTerms: [
      ...(jsonData.keywords || []),
      ...(jsonData.topicalTerms || []),
    ].join(","),
    genres: jsonData.genres ? jsonData.genres.join(",") : undefined,
  }

  console.log(parsedMarc)

  return bookEditionSchema.parse(parsedMarc)
}

export const bookEditionSchema = z.object({
  //245 a
  title: z.string().trim().min(1, "min1").max(255, "max255"),
  //245 b
  subTitle: z
    .string()
    .trim()
    .max(255, "max255")
    .optional()
    .transform((data) => data || undefined),
  //245c
  responsibility: z
    .string()
    .trim()
    .max(155, "max155")
    .optional()
    .transform((data) => data || undefined),
  //250 a
  edition: z
    .string()
    .trim()
    .max(155, "max155")
    .optional()
    .transform((data) => data || undefined),
  //not in marc21
  editionNumber: z.coerce.number().gt(0, "gt0").optional(),
  //041 a
  language: z
    .string()
    .trim()
    .max(50, "max50")
    .optional()
    .transform((data) => data || undefined),
  //041 h
  originLanguage: z
    .string()
    .trim()
    .max(50, "max50")
    .optional()
    .transform((data) => data || undefined),
  //520 a
  summary: z
    .string()
    .trim()
    .max(700, "max700")
    .optional()
    .transform((data) => data || undefined),
  //260 c
  publicationYear: z.coerce
    .number()
    .gt(0, "gt0")
    .optional()
    .refine(
      (data) => !data || data <= new Date().getFullYear(),
      "publicationYear"
    ),
  //260 b
  publisher: z.string().trim().optional(),
  //260 a
  publicationPlace: z.string().trim().optional(),
  //082 a ddc
  classificationNumber: z.string().trim().optional(),
  //082 b
  cutterNumber: z.string().trim().optional(),
  //020 a
  isbn: isbnSchema.optional(),
  //024a
  ean: z.string().trim().optional(),
  //020 c
  estimatedPrice: z.coerce
    .number()
    .gt(0, "gt0")
    .lte(9999999999, "lte9999999999")
    .optional(),
  //300 a
  pageCount: z.coerce
    .number()
    .gt(0, "gt0")
    .lte(2147483647, "lte2147483647")
    .optional(),
  //300 b
  physicalDetails: z
    .string()
    .trim()
    .max(100, "max100")
    .optional()
    .transform((data) => data || undefined),
  //300 c
  dimensions: z
    .string()
    .trim()
    .max(50, "max50")
    .optional()
    .transform((data) => data || undefined),
  //300 e
  accompanyingMaterial: z
    .string()
    .trim()
    .max(50, "max50")
    .optional()
    .transform((data) => data || undefined),
  //655 a
  genres: z
    .string()
    .trim()
    .max(255, "max255")
    .optional()
    .transform((data) => data || undefined),
  //500 a
  generalNote: z
    .string()
    .trim()
    .max(100, "max100")
    .optional()
    .transform((data) => data || undefined),
  //504 a
  bibliographicalNote: z
    .string()
    .trim()
    .max(100, "max100")
    .optional()
    .transform((data) => data || undefined),
  //650 a
  topicalTerms: z
    .string()
    .trim()
    .max(500, "max500")
    .optional()
    .transform((data) => data || undefined),
  //700a,e
  additionalAuthors: z
    .string()
    .trim()
    .max(500, "max500")
    .optional()
    .transform((data) => data || undefined),

  //100 a, only get from marc21, no input on UI
  author: z.string().optional(),
})
