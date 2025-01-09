import React from "react"
import { useForm } from "react-hook-form"

import { type TCreateBookRes } from "@/actions/books/create-book"

type Props = {
  trainAIData: TCreateBookRes
}

function TrainAIForm({ trainAIData }: Props) {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     username: "",
  //   },
  // })

  return (
    <div>
      {/* {trainAIData.editionImages.map(())} */}
      <div className="flex flex-col gap-4">tr</div>
    </div>
  )
}

export default TrainAIForm
