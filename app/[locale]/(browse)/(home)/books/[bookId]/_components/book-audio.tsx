"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Heart,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { dummyBooks } from "../../../_components/dummy-books"

type Props = {
  bookId?: number
  isPreview: boolean
  resourceId: number
}

const BookAudio = ({ bookId, isPreview, resourceId }: Props) => {
  const t = useTranslations("BookPage")

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const book = dummyBooks.find((book) => book.id === bookId)
  const { isLoadingAuth, accessToken } = useAuth()
  const [audioLink, setAudioLink] = useState<string | null>(null)
  const [loadingAudio, setLoadingAudio] = useState(true)
  const router = useRouter()

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

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSpeedChange = (value: string) => {
    const speed = Number.parseFloat(value)
    setPlaybackRate(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  useEffect(() => {
    console.log("fetchAudio")

    if (isLoadingAuth || !accessToken || audioLink) return
    async function fetchAudio() {
      try {
        const { data } = isPreview
          ? await http.get<Blob>(
              `/api/library-item/resource/${resourceId}/audio/preview`,
              {
                responseType: "blob",
              }
            )
          : await http.get<string>(
              `/api/library-items/resource/${resourceId}/audio`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )

        let blobUrl: string
        if (data instanceof Blob && data.size === 0) {
          throw Error("")
        }

        console.log({ data })

        if (typeof data === "string") {
          setAudioLink(data)
        } else if (data instanceof Blob) {
          blobUrl = URL.createObjectURL(data)
          setAudioLink(blobUrl)
        }
        setLoadingAudio(false)

        return () => URL.revokeObjectURL(blobUrl)
      } catch {
        // router.push("/not-found")
        return
      }
    }

    fetchAudio()
  }, [isLoadingAuth, isPreview, resourceId, accessToken, audioLink, router])

  useEffect(() => {
    console.log("volume")
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  if (isLoadingAuth || loadingAudio) {
    return (
      <div className="mt-12 flex w-screen max-w-full justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  if (!audioLink) {
    // router.push("/not-found")
    return
  }

  return (
    <div className="flex items-center gap-8 space-y-2 bg-zinc p-4">
      <section className="flex items-center gap-4">
        <Image
          width={50}
          height={80}
          src={dummyBooks[0].image || "/placeholder.svg"}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground">
                <ArrowLeftToLine className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="text-primary-foreground"
                onClick={() => handleSkip(-10)}
              >
                <RotateCcw className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>10s</p>
            </TooltipContent>
          </Tooltip>

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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="text-primary-foreground"
                onClick={() => handleSkip(10)}
              >
                <RotateCw className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>+10s</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground">
                <ArrowRightToLine className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Next</p>
            </TooltipContent>
          </Tooltip>
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

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="p-2 text-primary-foreground"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="size-5" />
                    ) : (
                      <Volume2 className="size-5" />
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-background">
                <Slider
                  defaultValue={[1]}
                  max={1}
                  step={0.01}
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  className="h-24 w-4 rounded-md bg-primary/60"
                  orientation="vertical"
                />
              </TooltipContent>
            </Tooltip>

            <Select
              onValueChange={handleSpeedChange}
              value={playbackRate.toString()}
            >
              <SelectTrigger className="w-[80px] text-primary-foreground">
                <SelectValue placeholder="1x" />
              </SelectTrigger>
              <SelectContent className="w-[80px]" align="center" side="top">
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      </TooltipProvider>

      <audio
        ref={audioRef}
        src={audioLink}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  )
}

export default BookAudio
