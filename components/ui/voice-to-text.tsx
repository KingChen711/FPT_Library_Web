"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Mic, StopCircle, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import wavEncoder from "wav-encoder"
import { type z } from "zod"

import { http } from "@/lib/http"
import { type LibraryItemLanguage } from "@/lib/types/models"
import { formUrlQuery } from "@/lib/utils"
import {
  voiceToTextSchema,
  type TVoiceToTextSchema,
} from "@/lib/validations/ai/voice-to-text"
import { predictVoiceToText } from "@/actions/ai/voice-to-text"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "./button"
import { Label } from "./label"

type CustomMediaRecorder = {
  stop: () => Promise<void>
}

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const VoiceToText = ({ open, setOpen }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [seconds, setSeconds] = useState<number>(0)
  const mediaRecorderRef = useRef<CustomMediaRecorder | null>(null)
  const timerRef = useRef<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<TVoiceToTextSchema>({
    resolver: zodResolver(voiceToTextSchema),
    defaultValues: {
      languageCode: "",
      audioFile: undefined,
    },
  })

  useEffect(() => {
    setAudioUrl(null)
    form.reset()
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [form, open])

  const { data: languages, isLoading: isLoadingLanguages } = useQuery({
    queryKey: ["library-items-languages"],
    queryFn: async () =>
      await http
        .get(`/api/library-items/available-languages`)
        .then((res) => res.data as LibraryItemLanguage[]),
    refetchOnWindowFocus: false,
  })

  if (isLoadingLanguages || !languages) {
    return null
  }

  const handleOnChange = (value: boolean) => {
    console.log("🚀 ~ handleOnChange ~ value:", value)
    setOpen(value)
    setAudioUrl(null)
  }

  const downloadAudio = () => {
    if (!audioBlob) return

    const link = document.createElement("a")
    link.href = audioUrl!
    link.download = "recording.wav"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const startRecording = async () => {
    try {
      form.clearErrors("audioFile")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      const audioData: Float32Array[] = []

      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer.getChannelData(0)
        audioData.push(new Float32Array(inputBuffer))
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      mediaRecorderRef.current = {
        stop: async () => {
          processor.disconnect()
          source.disconnect()
          stream.getTracks().forEach((track) => track.stop())

          if (audioData.length > 0) {
            const wavBlob = await convertToWav(audioData, 16000)
            setAudioBlob(wavBlob)
            setAudioUrl(URL.createObjectURL(wavBlob))

            const wavFile = new File([wavBlob], "recording.wav", {
              type: "audio/wav",
            })
            form.setValue("audioFile", wavFile)
            form.clearErrors("audioFile")
          }
        },
      }

      setIsRecording(true)
      setSeconds(0)
      timerRef.current = window.setInterval(
        () => setSeconds((prev) => prev + 1),
        1000
      )
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const convertToWav = async (
    audioData: Float32Array[],
    sampleRate: number
  ) => {
    // Ghép tất cả các mảng Float32Array thành một mảng duy nhất
    const mergedData = new Float32Array(
      audioData.reduce((acc, cur) => {
        const temp = new Float32Array(acc.length + cur.length)
        temp.set(acc)
        temp.set(cur, acc.length)
        return temp
      }, new Float32Array())
    )

    const wavArrayBuffer = await wavEncoder.encode({
      sampleRate,
      channelData: [mergedData],
    })

    return new Blob([wavArrayBuffer], { type: "audio/wav" })
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function onSubmit(values: z.infer<typeof voiceToTextSchema>) {
    startTransition(async () => {
      if (!audioBlob) {
        console.error("No audio file to submit.")
        return
      }
      const formData = new FormData()
      if (values.languageCode) {
        formData.append("languageCode", values.languageCode)
      }

      if (values.audioFile) {
        formData.append("audioFile", values.audioFile)
      }

      const res = await predictVoiceToText(formData)

      if (res?.isSuccess) {
        setOpen(false)
        form.reset()
        const newUrl = formUrlQuery({
          url: `/search/result`,
          params: searchParams.toString(),
          updates: {
            search: res.data.data,
          },
        })
        router.replace(newUrl, { scroll: false })
        return
      }
    })
  }

  return (
    <div>
      {open && (
        <Dialog open={open} onOpenChange={handleOnChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voice to text</DialogTitle>
              <DialogDescription>
                Press the mic button and start speaking. The text will be
                recognized and written in the text field.
              </DialogDescription>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="languageCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language Code</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose language" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((language) => (
                                <SelectItem
                                  key={language.languageCode}
                                  value={language.languageCode}
                                >
                                  {language.languageName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audioFile"
                    render={() => (
                      <FormItem>
                        <FormLabel>Audio File</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2 rounded-lg">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={
                                isRecording ? stopRecording : startRecording
                              }
                            >
                              {isRecording ? (
                                <div className="flex items-center gap-2">
                                  <StopCircle className="size-6" />
                                  Stop recording ({seconds}s)
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Mic className="size-6" />
                                  Start recording
                                </div>
                              )}
                            </Button>
                            {audioUrl && (
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label>Playback</Label>
                                  <Trash
                                    size={16}
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setAudioUrl(null)
                                      form.resetField("audioFile")
                                    }}
                                  />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <audio
                                    controls
                                    src={audioUrl}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    onClick={downloadAudio}
                                    variant="outline"
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isPending}>
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default VoiceToText
