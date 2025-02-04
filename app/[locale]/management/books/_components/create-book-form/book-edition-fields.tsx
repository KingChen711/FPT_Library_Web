// import { useEffect, useState, type SetStateAction } from "react"
// import { editorPlugin } from "@/constants"
// import { Editor } from "@tinymce/tinymce-react"
// import { Plus, X } from "lucide-react"
// import { useLocale, useTranslations } from "next-intl"
// import { useFieldArray, type UseFormReturn } from "react-hook-form"

// import { EBookFormat } from "@/lib/types/enums"
// import { type Author } from "@/lib/types/models"
// import { cn } from "@/lib/utils"
// import { type TMutateBookSchema } from "@/lib/validations/books/mutate-book"
// import useActualTheme from "@/hooks/utils/use-actual-theme"
// import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
// import { Button } from "@/components/ui/button"
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import AuthorsField from "./authors-field"
// import BookCopiesDialog from "./book-copies-dialog"
// import CoverImageField from "./cover-image-field"

// type Props = {
//   form: UseFormReturn<TMutateBookSchema>
//   isPending: boolean
//   currentEditionIndex: number
//   setCurrentEditionIndex: (val: number) => void
//   selectedAuthors: Author[]
//   setSelectedAuthors: React.Dispatch<SetStateAction<Author[]>>
// }

// function BookEditionFields({
//   form,
//   isPending,
//   currentEditionIndex,
//   setCurrentEditionIndex,
//   selectedAuthors,
//   setSelectedAuthors,
// }: Props) {
//   const theme = useActualTheme()
//   const locale = useLocale()

//   const [hasConfirmedAboutChangeStatus, setHasConfirmedAboutChangeStatus] =
//     useState(false)

//   const t = useTranslations("BooksManagementPage")
//   const { fields, append, remove } = useFieldArray({
//     name: "bookEditions",
//     control: form.control,
//   })

//   const title = form.getValues("title")

//   useEffect(() => {
//     form.setValue("bookEditions.0.editionTitle", title)
//   }, [form, title])

//   const summary = form.getValues("summary")

//   useEffect(() => {
//     form.setValue("bookEditions.0.editionSummary", summary)
//   }, [form, summary])

//   return (
//     <>
//       <div className="mb-6 flex flex-wrap items-center gap-4">
//         {Array(fields.length)
//           .fill(null)
//           .map((_, index) => (
//             <div
//               key={index}
//               className={cn(
//                 "flex h-full cursor-pointer items-center gap-4 rounded-md bg-primary px-2 py-1 text-center text-primary-foreground opacity-60",
//                 index === currentEditionIndex &&
//                   "cursor-default items-center opacity-100"
//               )}
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 setCurrentEditionIndex(index)
//               }}
//             >
//               {t("Edition")} {index + 1}
//               {index !== 0 && (
//                 <X
//                   onClick={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                     if (fields.length <= 1) return
//                     if (
//                       currentEditionIndex === index &&
//                       fields.length - 1 === index
//                     ) {
//                       setCurrentEditionIndex(0)
//                     }
//                     remove(index)
//                   }}
//                   className={cn(
//                     "size-4",
//                     (fields.length <= 1 || isPending || index === 0) &&
//                       "pointer-events-none cursor-not-allowed"
//                   )}
//                 />
//               )}
//             </div>
//           ))}
//         <Button
//           onClick={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             append(createBookEdition())
//           }}
//           variant="outline"
//           className="group"
//           disabled={isPending}
//         >
//           <Plus />
//           {t("More edition")}
//         </Button>
//       </div>

//       {fields.map((field, index) => {
//         if (index !== currentEditionIndex) return null

//         return (
//           <div key={field.id} className="mt-4 flex flex-col space-y-6">
//             <div className="flex flex-wrap justify-between gap-6">
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.editionTitle`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <div className="flex w-full flex-wrap items-center justify-between gap-4">
//                       <FormLabel className="flex items-center">
//                         {t("Edition title")}
//                         <span className="ml-1 text-xl font-bold leading-none text-primary">
//                           *
//                         </span>
//                       </FormLabel>
//                     </div>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         value={
//                           index === 0 ? form.getValues("title") : field.value
//                         }
//                         disabled={isPending || index === 0}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.isbn`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       ISBN
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.editionNumber`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Edition number")}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="number"
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.pageCount`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Page count")}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="number"
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.publicationYear`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Publication year")}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="number"
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.estimatedPrice`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Estimated price")}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="number"
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.publisher`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Publisher")}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name={`bookEditions.${index}.language`}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-1 flex-col items-start">
//                     <FormLabel className="flex items-center">
//                       {t("Language")}
//                       <span className="ml-1 text-xl font-bold leading-none text-transparent">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         className="min-w-96 max-w-full"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name={`bookEditions.${index}.editionSummary`}
//               render={({ field }) => (
//                 <FormItem className={cn("flex flex-1 flex-col items-start")}>
//                   <FormLabel className="flex items-center">
//                     {t("Edition summary")}
//                   </FormLabel>

//                   <FormControl>
//                     <Editor
//                       disabled={isPending}
//                       apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
//                       init={{
//                         ...editorPlugin,
//                         skin: theme === "dark" ? "oxide-dark" : undefined,
//                         content_css: theme === "dark" ? "dark" : undefined,
//                         width: "100%",
//                         language: locale,
//                       }}
//                       onEditorChange={field.onChange}
//                       value={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={`bookEditions.${index}.bookFormat`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {t("Book format")}
//                     <span className="ml-1 text-xl font-bold leading-none text-primary">
//                       *
//                     </span>
//                   </FormLabel>
//                   <Select
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {[EBookFormat.PAPERBACK, EBookFormat.HARD_COVER].map(
//                         (option) => (
//                           <SelectItem key={option} value={option}>
//                             {t(option)}
//                           </SelectItem>
//                         )
//                       )}
//                     </SelectContent>
//                   </Select>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={`bookEditions.${index}.bookCopies`}
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <div className="flex items-center gap-2">
//                     <FormLabel>
//                       {t("Book copies")}{" "}
//                       <span className="ml-1 text-xl font-bold leading-none text-primary">
//                         *
//                       </span>
//                     </FormLabel>
//                     <BookCopiesDialog
//                       form={form}
//                       isPending={isPending}
//                       editionIndex={index}
//                       hasConfirmedAboutChangeStatus={
//                         hasConfirmedAboutChangeStatus
//                       }
//                       setHasConfirmedAboutChangeStatus={
//                         setHasConfirmedAboutChangeStatus
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-wrap items-center gap-3">
//                     {field.value.length === 0 && (
//                       <div className="text-sm text-muted-foreground">
//                         {t("Empty copies")}
//                       </div>
//                     )}
//                     {field.value.map((bc) => (
//                       <div
//                         key={bc.barcode}
//                         className="relative flex flex-row items-center gap-x-4 rounded-md border bg-muted px-2 py-1 text-muted-foreground"
//                       >
//                         <div className="flex flex-col text-sm">
//                           <div>
//                             <strong>{t("Code")}:</strong> {bc.barcode}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <strong>{t("Status")}:</strong>
//                             <BookConditionStatusBadge
//                               status={bc.conditionStatus}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <AuthorsField
//               selectedAuthors={selectedAuthors}
//               setSelectedAuthors={setSelectedAuthors}
//               form={form}
//               index={index}
//               isPending={isPending}
//             />

//             <CoverImageField
//               selectedAuthors={selectedAuthors}
//               form={form}
//               index={index}
//               isPending={isPending}
//             />
//           </div>
//         )
//       })}
//     </>
//   )
// }

// export default BookEditionFields

// export const createBookEdition = () => {
//   return {
//     authorIds: [],
//     bookCopies: [],
//     bookFormat: EBookFormat.PAPERBACK,
//     coverImage: "",
//     editionNumber: 0,
//     editionSummary: "",
//     editionTitle: "",
//     estimatedPrice: 0,
//     file: undefined,
//     isbn: "",
//     language: "",
//     pageCount: 0,
//     publicationYear: 0,
//     publisher: "",
//     validImage: undefined,
//   }
// }
