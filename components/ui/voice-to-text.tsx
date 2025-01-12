"use client"

import { useRef, useState, useTransition } from "react"
import { Mic, StopCircle, Trash } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
        // const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" })

        convertToWav(audioBlob)
        audioChunks.current = [] // Clear the chunks
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
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

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const convertToWav = (audioBlob: Blob) => {
    // Convert WebM to WAV (use third-party library or server-side processing if needed)
    setAudioBlob(audioBlob) // Store the blob for submission
    const wavUrl = URL.createObjectURL(audioBlob)
    setAudioUrl(wavUrl)
  }

  const handleSubmit = async () => {
    startTransition(() => {
      if (!audioBlob) {
        console.error("No audio file to submit.")
        return
      }

      console.log(audioBlob)

      const formData = new FormData()
      formData.append("file", audioBlob, "recording.wav")

      console.log(formData.get("file"))

      // try {
      //   const response = await fetch("/api/upload", {
      //     method: "POST",
      //     body: formData,
      //   })

      //   if (response.ok) {
      //     console.log("File uploaded successfully!")
      //   } else {
      //     console.error("File upload failed.", response.statusText)
      //   }
      // } catch (error) {
      //   console.error("Error uploading file:", error)
      // }

      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "recording.wav"
      a.click()
      URL.revokeObjectURL(url)
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
                    onClick={() => setAudioUrl(null)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <audio controls src={audioUrl} className="flex-1" />
                  <Button
                    onClick={handleSubmit}
                    disabled={!audioBlob || isPending}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default VoiceToText
