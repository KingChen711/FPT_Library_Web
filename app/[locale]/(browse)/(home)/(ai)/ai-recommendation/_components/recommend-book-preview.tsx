import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { CheckCircle2, CircleX, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  type LibraryItem,
  type LibraryItemsRecommendation,
} from "@/lib/types/models"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

type Props = {
  result: LibraryItemsRecommendation
  detectedLibraryItem: LibraryItem
  comparedLibraryItemId: number
}

const RecommendBookPreview = ({
  result,
  detectedLibraryItem,
  comparedLibraryItemId,
}: Props) => {
  const t = useTranslations("AI")
  const tBookPage = useTranslations("BookPage")
  const router = useRouter()
  const { data: comparedLibraryItem, isLoading: isLoadingComparedLibraryItem } =
    useLibraryItemDetail(comparedLibraryItemId)

  if (isLoadingComparedLibraryItem) return <Loader2 className="animate-spin" />
  if (!detectedLibraryItem || !comparedLibraryItem) {
    router.push("/ai-recommendation")
    return null
  }
  const renderTableRow = (
    label: string,
    detectedValue: string | undefined,
    comparedValue: string | undefined,
    isMatched: boolean
  ) => (
    <TableRow>
      <TableCell className="bg-primary font-semibold text-primary-foreground">
        {tBookPage(`fields.${label.charAt(0).toLowerCase() + label.slice(1)}`)}
      </TableCell>
      <TableCell className="border">{detectedValue}</TableCell>
      <TableCell className="border">{comparedValue}</TableCell>
      <TableCell className="border text-center">
        {isMatched ? (
          <CheckCircle2 size={24} className="mx-auto text-success" />
        ) : (
          <CircleX size={24} className="mx-auto text-danger" />
        )}
      </TableCell>
    </TableRow>
  )

  return (
    <Table>
      <TableBody>
        {/* Image Row */}
        <TableRow>
          <TableCell className="w-[140px] border" />
          <TableCell className="h-[250px] w-[200px] border p-4">
            <div className="relative size-full">
              <Image
                src={
                  (detectedLibraryItem.coverImage as string) ||
                  "/placeholder.svg"
                }
                alt={detectedLibraryItem.title}
                fill
                className="object-contain"
              />
            </div>
          </TableCell>
          <TableCell className="h-[250px] w-[200px] border p-4">
            <div className="relative size-full">
              <Image
                src={
                  (comparedLibraryItem.coverImage as string) ||
                  "/placeholder.svg"
                }
                alt={comparedLibraryItem.title}
                fill
                className="object-contain"
              />
            </div>
          </TableCell>
          <TableCell className="w-[80px] border" />
        </TableRow>

        {/* Header Row */}
        <TableRow className="bg-primary hover:bg-primary">
          <TableCell className="border font-semibold text-primary-foreground" />
          <TableCell className="border text-center font-semibold text-primary-foreground">
            {t("detected book")}
          </TableCell>
          <TableCell className="border text-center font-semibold text-primary-foreground">
            {t("compared book")}
          </TableCell>
          <TableCell className="border text-center font-semibold text-primary-foreground">
            {t("match")}
          </TableCell>
        </TableRow>

        {/* Content Rows */}
        {renderTableRow(
          "Title",
          detectedLibraryItem.title,
          comparedLibraryItem.title,
          result.matchedProperties.find((item) => item.name === "Title")
            ?.isMatched ?? false
        )}
        {renderTableRow(
          "Subtitle",
          detectedLibraryItem.subTitle?.toString(),
          comparedLibraryItem.subTitle?.toString(),
          result.matchedProperties.find((item) => item.name === "SubTitle")
            ?.isMatched ?? false
        )}
        {renderTableRow(
          "Language",
          detectedLibraryItem.language,
          comparedLibraryItem.language,
          result.matchedProperties.find((item) => item.name === "Language")
            ?.isMatched ?? false
        )}
        {renderTableRow(
          "OriginLanguage",
          detectedLibraryItem.originLanguage?.toString(),
          comparedLibraryItem.originLanguage?.toString(),
          result.matchedProperties.find(
            (item) => item.name === "OriginLanguage"
          )?.isMatched ?? false
        )}
        {renderTableRow(
          "PublicationYear",
          detectedLibraryItem.publicationYear?.toString(),
          comparedLibraryItem.publicationYear?.toString(),
          result.matchedProperties.find(
            (item) => item.name === "PublicationYear"
          )?.isMatched ?? false
        )}
        {renderTableRow(
          "Publisher",
          detectedLibraryItem.publisher?.toString(),
          comparedLibraryItem.publisher?.toString(),
          result.matchedProperties.find((item) => item.name === "Publisher")
            ?.isMatched ?? false
        )}
        {renderTableRow(
          "ClassificationNumber",
          detectedLibraryItem.classificationNumber?.toString(),
          comparedLibraryItem.classificationNumber?.toString(),
          result.matchedProperties.find(
            (item) => item.name === "ClassificationNumber"
          )?.isMatched ?? false
        )}
        {renderTableRow(
          "CutterNumber",
          detectedLibraryItem.cutterNumber?.toString(),
          comparedLibraryItem.cutterNumber?.toString(),
          result.matchedProperties.find((item) => item.name === "CutterNumber")
            ?.isMatched ?? false
        )}
      </TableBody>
    </Table>
  )
}

export default RecommendBookPreview
