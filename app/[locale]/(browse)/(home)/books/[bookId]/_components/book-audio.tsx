"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Heart, Pause, Play, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { dummyBooks } from "../../../_components/dummy-books"

type Props = {
  bookId: string
}

const BookAudio = ({ bookId }: Props) => {
  const t = useTranslations("BookPage")

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  return (
    <div className="flex items-center gap-8 space-y-2 bg-zinc p-4">
      <section className="flex items-center gap-4">
        <Image
          width={50}
          height={80}
          src={dummyBooks[0].image}
          alt="Book thumbnail"
          className="rounded-md"
        />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-primary-foreground">
            {book?.title}
          </h3>
          <p className="text-xs text-zinc-400">by {book?.author}</p>
        </div>
      </section>

      <div className="flex flex-1 flex-col">
        <section className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {formatTime(currentTime)}
          </span>
          <Slider
            defaultValue={[0]}
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value: number[]) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value[0]
                setCurrentTime(value[0])
              }
            }}
            className="mx-4 flex-1"
          />
          <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
        </section>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            className="text-primary-foreground"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="size-5" /> {t("pause")}
              </>
            ) : (
              <>
                <Play className="size-5" /> {t("play")}
              </>
            )}
          </Button>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <section className="flex items-center justify-between">
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground">
                  <Heart className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("like")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground">
                  <Share2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("share")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>
      </TooltipProvider>

      <audio
        ref={audioRef}
        src={
          "https://ia803008.us.archive.org/3/items/a_day_with_great_poets_1308_librivox/a_day_with_great_poets_01_byron_128kb.mp3"
        }
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  )
}

export default BookAudio
