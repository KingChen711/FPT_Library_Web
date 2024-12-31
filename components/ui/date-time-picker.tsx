"use client"

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import {
  createCalendar,
  fromDate,
  getLocalTimeZone,
  parseDateTime,
  toCalendarDate,
  toCalendarDateTime,
} from "@internationalized/date"
import { type DateSegment as IDateSegment } from "@react-stately/datepicker"
import { CalendarIcon, X } from "lucide-react"
import {
  useButton,
  useDateField,
  useDatePicker,
  useDateSegment,
  useLocale,
  useTimeField,
  type AriaDatePickerProps,
  type AriaTimeFieldProps,
  type DateValue,
  type TimeValue,
} from "react-aria"
import { type Matcher, type SelectSingleEventHandler } from "react-day-picker"
import {
  useDateFieldState,
  useDatePickerState,
  useTimeFieldState,
  type DateFieldState,
  type DatePickerState,
  type DatePickerStateOptions,
  type TimeFieldStateOptions,
} from "react-stately"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DateSegmentProps {
  segment: IDateSegment
  state: DateFieldState
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null)

  const {
    segmentProps: { ...segmentProps },
  } = useDateSegment(segment, state, ref)

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none",
        segment.type !== "literal" && "px-px",
        segment.isPlaceholder && "text-muted-foreground"
      )}
    >
      {segment.text}
    </div>
  )
}

function DateField(props: AriaDatePickerProps<DateValue>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })
  const { fieldProps } = useDateField(
    { ...props, "aria-label": "date-field" },
    state,
    ref
  )

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 flex-1 items-center rounded-l-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled && "cursor-not-allowed opacity-50"
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
      {state.isInvalid && <span aria-hidden="true">🚫</span>}
    </div>
  )
}

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const { locale } = useLocale()
  const state = useTimeFieldState({
    ...props,
    locale,
  })
  const {
    fieldProps: { ...fieldProps },
  } = useTimeField({ ...props, "aria-label": "time-field" }, state, ref)

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled && "cursor-not-allowed opacity-50"
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  )
}

const TimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, "locale">
>((props, ref) => {
  return <TimeField {...props} />
})

TimePicker.displayName = "TimePicker"

export type DateTimePickerRef = {
  divRef: HTMLDivElement | null
  buttonRef: HTMLButtonElement | null
  contentRef: HTMLDivElement | null
  jsDate: Date | null
  state: DatePickerState
}

const DateTimePicker = React.forwardRef<
  DateTimePickerRef,
  DatePickerStateOptions<DateValue> & {
    jsDate?: Date | null | undefined | string
    onJsDateChange?: (date: Date) => void
    showClearButton?: boolean
    disabled?: Matcher | Matcher[]
  }
>(
  (
    { jsDate, onJsDateChange, disabled, showClearButton = true, ...props },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [jsDatetime, setJsDatetime] = useState<Date | null>(
      typeof jsDate === "string" ? new Date(jsDate) : jsDate || null
    )

    const state = useDatePickerState(props)

    useImperativeHandle(ref, () => ({
      divRef: divRef.current,
      buttonRef: buttonRef.current,
      contentRef: contentRef.current,
      jsDate: jsDatetime,
      state,
    }))
    const {
      groupProps,
      fieldProps,
      buttonProps: _buttonProps,
      dialogProps,
    } = useDatePicker({ ...props, "aria-label": "date-picker" }, state, divRef)
    const { buttonProps } = useButton(_buttonProps, buttonRef)

    const currentValue = useCallback(() => {
      if (!jsDatetime) {
        return null
      }

      const parsed = fromDate(jsDatetime, getLocalTimeZone())

      if (state.hasTime) {
        return toCalendarDateTime(parsed)
      }

      return toCalendarDate(parsed)
    }, [jsDatetime, state.hasTime])

    useEffect(() => {
      /**
       * If user types datetime, it will be a null value until we get the correct datetime.
       * This is controlled by react-aria.
       **/
      if (state.value) {
        const date = parseDateTime(state.value.toString()).toDate(
          getLocalTimeZone()
        )
        setJsDatetime(date)
        onJsDateChange?.(date)
      }
    }, [state.value, onJsDateChange])
    return (
      <div
        {...groupProps}
        ref={divRef}
        className={cn(
          groupProps.className,
          "flex items-center rounded-md border ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        <Popover open={props.isOpen} onOpenChange={props.onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              {...buttonProps}
              variant="ghost"
              className="border-r"
              disabled={props.isDisabled}
              onClick={() => {
                state.setOpen(true)
              }}
            >
              <CalendarIcon className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent ref={contentRef} className="w-full">
            <div {...dialogProps} className="space-y-3">
              <Calendar
                mode="single"
                selected={jsDatetime || undefined}
                onSelect={onJsDateChange as SelectSingleEventHandler}
                disabled={disabled}
              />
              {state.hasTime && (
                <TimePicker
                  value={state.timeValue}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  onChange={(value) => state.setTimeValue(value)}
                />
              )}
            </div>
          </PopoverContent>
        </Popover>
        <DateField {...fieldProps} value={currentValue()} />
        <div className={cn("-ml-2 mr-2 size-5", !showClearButton && "hidden")}>
          <X
            className={cn(
              "size-5 cursor-pointer text-primary/30",
              !jsDatetime && "hidden"
            )}
            onClick={() => setJsDatetime(null)}
          />
        </div>
      </div>
    )
  }
)

DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker, TimePicker }
