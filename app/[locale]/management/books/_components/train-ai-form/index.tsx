// import React, { useEffect, useState, useTransition } from "react"
// import { useRouter } from "@/i18n/routing"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Loader2 } from "lucide-react"
// import { useTranslations } from "next-intl"
// import { useForm } from "react-hook-form"

// import { fileUrlToFile } from "@/lib/utils"
// import {
//   trainBookSchema,
//   type TCheckedResultSchema,
//   type TTrainBookSchema,
// } from "@/lib/validations/books/train-book"
// import { type TCreateBookRes } from "@/actions/books/create-book"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form"

// import EditionImagesFields from "./edition-images-fields"

// type Props = {
//   trainAIData: TCreateBookRes & {
//     checkedResults: (TCheckedResultSchema & { file: File })[]
//   }
// }

// function TrainAIForm({ trainAIData }: Props) {
//   const t = useTranslations("BooksManagementPage")
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   const form = useForm<TTrainBookSchema>({
//     resolver: zodResolver(trainBookSchema),
//     defaultValues: {
//       bookCode: trainAIData.bookCodeForAITraining,
//       editionImages: trainAIData.editionImages.map((imageUrl, i) => [
//         {
//           url: imageUrl,
//           file: trainAIData.checkedResults[i].file,
//           validImage: true,
//           checkedResult: trainAIData.checkedResults[i],
//         },
//       ]),
//     },
//   })

//   console.log(trainAIData)

//   const onSubmit = async (values: TTrainBookSchema) => {}

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
//           <FormField
//             control={form.control}
//             name="editionImages"
//             render={() => (
//               <FormItem>
//                 <FormControl>
//                   <EditionImagesFields form={form} isPending={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex justify-end gap-x-4">
//             <Button
//               disabled={isPending}
//               variant="secondary"
//               className="float-right mt-4"
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 router.push("/management/books")
//               }}
//             >
//               {t("Skip")}
//             </Button>

//             <Button
//               disabled={isPending}
//               type="submit"
//               className="float-right mt-4"
//             >
//               {t("Train")}
//               {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }

// export default TrainAIForm
