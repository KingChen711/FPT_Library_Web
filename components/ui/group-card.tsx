"use client"

import { format } from "date-fns"
import { Book, Calendar, FileText, Tag, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { type LibraryItemGroup } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

type Props = {
  group: LibraryItemGroup
  className?: string
  onClick?: () => void
}

export default function GroupCard({ group, className, onClick }: Props) {
  const formatLocale = useFormatLocale()
  const t = useTranslations("BooksManagementPage")

  const topics = group?.topicalTerms?.replaceAll(", ", ",").split(",") || []

  return (
    <TooltipProvider>
      <Card
        onClick={() => {
          if (onClick) onClick()
        }}
        className={cn(
          "w-full max-w-md border-2 transition-shadow duration-300 hover:shadow-lg",
          onClick && "cursor-pointer",
          className
        )}
      >
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="line-clamp-1 text-xl font-bold text-primary">
                {group.title}
              </CardTitle>
              {group.subTitle && (
                <CardDescription>{group.subTitle}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center">
            <User className="mr-2 size-4 text-primary" />
            <span className="font-medium">{t("Authors")}:</span>
            <span className="ml-2">{group.author}</span>
          </div>

          <div className="flex items-center">
            <Book className="mr-2 size-4 text-primary" />
            <span className="font-medium">DDC:</span>
            <span className="ml-2 font-mono">{group.classificationNumber}</span>
          </div>

          <div className="flex items-center">
            <Book className="mr-2 size-4 text-primary" />
            <span className="font-medium">{t("Cutter number")}:</span>
            <span className="ml-2 font-mono">{group.cutterNumber}</span>
          </div>

          <div>
            <div className="mb-2 flex items-center">
              <Tag className="mr-2 size-4 text-primary" />
              <span className="font-medium">{t("Topical terms")}:</span>
            </div>
            <div className="ml-6 flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <Badge key={index} className="shrink-0">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <>
            <Separator />

            <div className="space-y-2">
              <div className="flex items-center">
                <FileText className="mr-2 size-4 text-primary" />
                <span className="text-nowrap font-medium">
                  {t("AI train code")}:
                </span>
                <span className="ml-2 truncate font-mono text-xs">
                  {group.aiTrainingCode}
                </span>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-2 size-4 text-primary" />
                <span className="font-medium">{t("Created at")}:</span>
                <span className="ml-2">
                  {format(new Date(group.createdAt), "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })}
                </span>
              </div>

              <div className="flex items-center">
                <User className="mr-2 size-4 text-primary" />
                <span className="font-medium">{t("Create by")}:</span>
                <span className="ml-2">{group.createdBy}</span>
              </div>
            </div>
          </>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
