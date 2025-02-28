// "use client"

// import * as React from "react"
// import { format, isValid, parse } from "date-fns"
// import { enUS, vi } from "date-fns/locale"
// import { CalendarIcon } from "lucide-react"
// import { useLocale } from "next-intl"

// import { cn } from "@/lib/utils"
// import { Calendar } from "@/components/ui/calendar"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// interface DatePickerProps {
//   value?: Date | null
//   onChange?: (date: Date | undefined | null) => void
//   disabledDates?: (date: Date) => boolean
//   disabled?: boolean
//   className?: string
// }

// export function DatePicker({
//   value,
//   onChange,
//   disabledDates,
//   disabled: disable = false,
//   className,
// }: DatePickerProps) {
//   const id = React.useId()
//   const locale = useLocale()

//   const [date, setDate] = React.useState<Date | undefined>(value || undefined)
//   const [inputValue, setInputValue] = React.useState<string>(
//     date ? format(date, "dd/MM/yyyy") : ""
//   )
//   const [open, setOpen] = React.useState(false)

//   // Update internal state when prop value changes
//   React.useEffect(() => {
//     if (value) {
//       setDate(value)
//       setInputValue(format(value, "dd/MM/yyyy"))
//     } else {
//       setDate(undefined)
//       if (value === undefined) {
//         setInputValue("")
//       }
//     }
//   }, [value])

//   // Handle date selection from calendar
//   const handleSelect = (selectedDate: Date | undefined) => {
//     setDate(selectedDate)
//     if (selectedDate) {
//       setInputValue(format(selectedDate, "dd/MM/yyyy"))
//       //   setError(false)
//     } else {
//       setInputValue("")
//     }
//     onChange?.(selectedDate)
//     setOpen(false)
//   }

//   // Handle manual input with auto-formatting
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const input = e.target.value
//     const cursorPosition = e.target.selectionStart || 0

//     // Remove all non-numeric characters
//     const numbersOnly = input.replace(/[^\d]/g, "")

//     // Format with slashes
//     let formatted = ""
//     let newCursorPosition = cursorPosition

//     // Add numbers and format with slashes
//     for (let i = 0; i < numbersOnly.length && i < 8; i++) {
//       if (i === 2 || i === 4) {
//         formatted += "/"
//         // If we're adding a slash at or before the cursor position, move the cursor forward
//         if (formatted.length <= cursorPosition) {
//           newCursorPosition++
//         }
//       }
//       formatted += numbersOnly[i]
//     }

//     // Handle backspace at slash positions
//     if (
//       input.length < inputValue.length &&
//       (cursorPosition === 3 || cursorPosition === 6) &&
//       input[cursorPosition - 1] !== "/"
//     ) {
//       formatted =
//         formatted.substring(0, cursorPosition - 2) +
//         formatted.substring(cursorPosition - 1)
//       newCursorPosition = cursorPosition - 1
//     }

//     setInputValue(formatted)

//     // Update the date if we have a complete, valid format
//     if (formatted.length === 10) {
//       const parsedDate = parse(formatted, "dd/MM/yyyy", new Date())

//       if (isValid(parsedDate)) {
//         // Check if the date is disabled
//         if (disabledDates && disabledDates(parsedDate)) {
//           onChange?.(null)
//         } else {
//           setDate(parsedDate)
//           onChange?.(parsedDate)
//         }
//       } else {
//         onChange?.(null)
//       }
//     } else if (formatted.length > 0 && formatted.length < 10) {
//       onChange?.(null)
//     } else if (formatted.length === 0) {
//       // Empty input
//       setDate(undefined)
//       //   setError(false)
//       onChange?.(undefined)
//     }

//     // Set cursor position after React updates the DOM
//     setTimeout(() => {
//       const input = document.getElementById(id) as HTMLInputElement
//       if (input) {
//         input.setSelectionRange(newCursorPosition, newCursorPosition)
//       }
//     }, 0)
//   }

//   // Handle blur event for validation
//   const handleBlur = () => {
//     if (inputValue) {
//       if (inputValue.length === 10) {
//         const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date())
//         if (!isValid(parsedDate)) {
//           //   setError(true)
//         } else if (disabledDates && disabledDates(parsedDate)) {
//           //   setError(true)
//         }
//       } else {
//         // Incomplete date
//         // setError(true)
//       }
//     }
//   }

//   // Add this new function for handling keydown events
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Allow: backspace, delete, tab, escape, enter, and numbers
//     if (
//       [8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
//       // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
//       (e.keyCode >= 35 && e.keyCode <= 39) ||
//       (e.ctrlKey && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
//       // Allow: numbers
//       (e.keyCode >= 48 && e.keyCode <= 57) ||
//       (e.keyCode >= 96 && e.keyCode <= 105)
//     ) {
//       // Let it happen
//       return
//     }

//     // Prevent default for all other keys
//     e.preventDefault()
//   }

//   // Get localized strings
//   const placeholderText = locale === "vi" ? "dd/mm/yyyy" : "dd/mm/yyyy"

//   // Get date-fns locale
//   const dateLocale = locale === "vi" ? vi : enUS

//   return (
//     <div
//       className={cn(
//         "relative flex items-center rounded-md border pr-3",
//         className
//       )}
//     >
//       <Input
//         id={id}
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyDown}
//         onBlur={handleBlur}
//         placeholder={placeholderText}
//         className={cn(
//           "!border-none !outline-none !ring-0",
//           disable && "flex-1 cursor-not-allowed opacity-50"
//         )}
//         disabled={disable}
//         maxLength={10}
//       />
//       <Popover open={open && !disable} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <CalendarIcon className="size-4 cursor-pointer" />
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleSelect}
//             disabled={disabledDates || disable}
//             locale={dateLocale}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }
