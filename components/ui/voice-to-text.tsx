"use client"

import { useRef, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Mic, StopCircle, Trash } from "lucide-react"
import { useLocale } from "next-intl"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { http } from "@/lib/http"
import { type LibraryItemLanguage } from "@/lib/types/models"
import {
  voiceToTextSchema,
  type TVoiceToTextSchema,
} from "@/lib/validations/ai/voice-to-text"
import { predictVoiceToText } from "@/actions/ai/voice-to-text"
import { toast } from "@/hooks/use-toast"
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

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const VoiceToText = ({ open, setOpen }: Props) => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [seconds, setSeconds] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const form = useForm<TVoiceToTextSchema>({
    resolver: zodResolver(voiceToTextSchema),
    defaultValues: {
      languageCode: "",
      audioFile: undefined,
    },
  })

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
    setOpen(value)
    setAudioUrl(null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data)
      }
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" })
        convertToWav(audioBlob)
        audioChunks.current = []
      }

      mediaRecorder.start()
      setIsRecording(true)
      setSeconds(0)
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
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

  const convertToWav = (audioBlob: Blob) => {
    setAudioBlob(audioBlob)
    const wavUrl = URL.createObjectURL(audioBlob)
    setAudioUrl(wavUrl)
    form.setValue(
      "audioFile",
      new File([audioBlob], "recording.wav", { type: "audio/wav" })
    )
    form.clearErrors("audioFile")
  }

  function onSubmit(values: z.infer<typeof voiceToTextSchema>) {
    console.log(values)

    startTransition(async () => {
      if (!audioBlob) {
        console.error("No audio file to submit.")
        return
      }
      const formData = new FormData()
      formData.append("audioFile", audioBlob, "recording.wav")
      if (values.languageCode) {
        formData.append("languageCode", values.languageCode)
      }
      console.log(formData.get("languageCode"))
      console.log(formData.get("audioFile"))
      const res = await predictVoiceToText(formData)

      console.log("🚀 ~ startTransition ~ res:", res)

      if (res?.isSuccess) {
        console.log(res.data)
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })
        setOpen(false)
        form.reset()
        return
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOnChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voice to text</DialogTitle>
          <DialogDescription>
            Press the mic button and start speaking. The text will be recognized
            and written in the text field.
          </DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          variant="outline"
                          onClick={isRecording ? stopRecording : startRecording}
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
  )
}

export default VoiceToText
