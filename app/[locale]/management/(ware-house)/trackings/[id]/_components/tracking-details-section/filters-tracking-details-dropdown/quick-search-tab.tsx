// "use client"

// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Search } from "lucide-react"
// import { useTranslations } from "next-intl"
// import { z } from "zod"

// import { ESearchType } from "@/lib/types/enums"
// import { formUrlQuery } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// const QuickSearchTab = () => {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const t = useTranslations("BasicSearchTab")

//   const [keywordValue, setKeywordValue] = useState(() =>
//     z
//       .enum(["0", "1", "quick"])
//       .catch("quick")
//       .parse(searchParams.get("searchWithKeyword"))
//   )

//   const [searchValue, setSearchValue] = useState(
//     searchParams.get("search") || ""
//   )

//   const handleApply = () => {
//     if (!searchValue) return

//     const newUrl = formUrlQuery({
//       params: searchParams.toString(),
//       updates: {
//         // pageIndex: "1",
//         // searchType: ESearchType.QUICK_SEARCH.toString(),
//         // isMatchExact: isMatchExact ? "true" : "false",
//         // searchWithSpecial: searchWithSpecial ? "true" : "false",
//         // searchWithKeyword: keywordValue === "quick" ? null : keywordValue,
//         // search: searchValue,
//       },
//     }).replace(window.location.pathname, "/books")

//     router.push(newUrl)
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2">
//         <Select
//           value={keywordValue}
//           onValueChange={(val: "0" | "1" | "quick") => setKeywordValue(val)}
//         >
//           <SelectTrigger className="w-[180px] shrink-0">
//             <SelectValue placeholder="Keywords" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="quick">{t("All")}</SelectItem>
//             <SelectItem value="0">{t("Item name")}</SelectItem>
//             <SelectItem value="1">ISBN</SelectItem>
//           </SelectContent>
//         </Select>

//         <Input
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="flex-1"
//           placeholder={t("Enter search value")}
//         />
//         <Button
//           onClick={handleApply}
//           className="flex shrink-0 flex-nowrap items-center gap-2"
//         >
//           <Search /> {t("Search")}
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default QuickSearchTab
