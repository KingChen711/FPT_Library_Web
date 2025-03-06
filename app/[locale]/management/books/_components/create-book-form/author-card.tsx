"use client"

import type React from "react"
import { format } from "date-fns"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ParseHtml from "@/components/ui/parse-html"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AuthorCardProps {
  author: Author
  onClick?: () => void
  onClose?: () => void
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  onClick,
  onClose,
}) => {
  const formatLocale = useFormatLocale()
  const t = useTranslations("BooksManagementPage")
  const formatDate = (date: Date | null) => {
    return date ? format(date, "dd MMM yyyy", { locale: formatLocale }) : "N/A"
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            onClick={() => {
              if (onClick) {
                onClick()
              }
            }}
            className={cn(
              "relative flex items-center space-x-2 rounded-md border p-2",
              onClick && "cursor-pointer"
            )}
          >
            <Avatar className="size-8">
              <AvatarImage src={author.authorImage || undefined} />
              <AvatarFallback>
                {author.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex w-40 flex-col items-start">
              <span className="line-clamp-1 font-semibold">
                {author.fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                {author.authorCode}
              </span>
            </div>

            {onClose && (
              <X
                onClick={onClose}
                className="absolute right-2 top-2 size-4 cursor-pointer"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="w-96 border bg-background p-0 text-foreground"
        >
          <div className="flex flex-col p-4">
            <div className="mb-4 flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={author.authorImage || undefined} />
                <AvatarFallback>
                  {author.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{author.fullName}</h4>
                <p className="text-sm text-muted-foreground">
                  {author.authorCode}
                </p>
              </div>
            </div>
            {author.biography && <ParseHtml data={author.biography} />}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="font-semibold">{t("Nationality")}:</span>{" "}
                {author.nationality || "N/A"}
              </p>

              <p>
                <span className="font-semibold">{t("Born")}:</span>{" "}
                {author.dob ? formatDate(new Date(author.dob)) : "N/A"}
              </p>

              <p>
                <span className="font-semibold">{t("Died")}:</span>{" "}
                {author.dateOfDeath
                  ? formatDate(new Date(author.dateOfDeath))
                  : "N/A"}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AuthorCard
