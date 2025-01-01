"use client"

import React, { useMemo, useRef, useState } from "react"
import {
  isToday as _isToday,
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
} from "@internationalized/date"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useLocale } from "next-intl"
import {
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDateField,
  useDatePicker,
  useDateSegment,
  useInteractOutside,
  useTimeField,
  type AriaDatePickerProps,
  type AriaTimeFieldProps,
  type CalendarProps,
  type DateValue,
  type TimeValue,
} from "react-aria"
import {
  useCalendarState,
  useDateFieldState,
  useDatePickerState,
  useTimeFieldState,
  type CalendarState,
  type DateFieldState,
  type DatePickerStateOptions,
  type DateSegment as IDateSegment,
  type TimeFieldStateOptions,
} from "react-stately"

import { cn } from "@/lib/utils"
import { useForwardedRef } from "@/hooks/utils/use-forwarded-ref"

import { Button } from "../button"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"

const TimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, "locale">
>((props, _forwardedRef) => {
  return <TimeField {...props} />
})

TimePicker.displayName = "TimePicker"

export { TimePicker }

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const locale = useLocale() === "vi" ? "vi-VN" : "en-US"
  const state = useTimeFieldState({
    ...props,
    locale,
  })
  const {
    fieldProps: { ...fieldProps },
    // labelProps,
  } = useTimeField(props, state, ref)

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled ? "cursor-not-allowed opacity-50" : ""
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  )
}

export { TimeField }

function DateField(props: AriaDatePickerProps<DateValue>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const locale = useLocale() === "vi" ? "vi-VN" : "en-US"
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })
  const { fieldProps } = useDateField(props, state, ref)

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 flex-1 shrink-0 items-center rounded-l-md border border-r-0 border-input bg-transparent py-2 pl-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled ? "cursor-not-allowed opacity-50" : ""
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
      {state.validationState === "invalid" && (
        <span aria-hidden="true">🚫</span>
      )}
    </div>
  )
}

export { DateField }

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
        segment.type !== "literal" ? "px-px" : "",
        segment.isPlaceholder ? "text-muted-foreground" : ""
      )}
    >
      {segment.text}
    </div>
  )
}

export { DateSegment }

function Calendar(
  props: CalendarProps<DateValue> & { disabled?: (val: Date) => boolean }
) {
  const prevButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const nextButtonRef = React.useRef<HTMLButtonElement | null>(null)

  const locale = useLocale() === "vi" ? "vi-VN" : "en-US"
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  })
  const {
    calendarProps,
    prevButtonProps: _prevButtonProps,
    nextButtonProps: _nextButtonProps,
    title,
  } = useCalendar(props, state)
  const { buttonProps: prevButtonProps } = useButton(
    _prevButtonProps,
    prevButtonRef
  )
  const { buttonProps: nextButtonProps } = useButton(
    _nextButtonProps,
    nextButtonRef
  )

  return (
    <div {...calendarProps} className="space-y-4">
      <div className="relative flex items-center justify-center pt-1">
        <Button
          {...prevButtonProps}
          ref={prevButtonRef}
          variant={"outline"}
          className={cn(
            "absolute left-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <div className="text-sm font-medium">{title}</div>
        <Button
          {...nextButtonProps}
          ref={nextButtonRef}
          variant={"outline"}
          className={cn(
            "absolute right-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
      <CalendarGrid state={state} disabled={props.disabled} />
    </div>
  )
}

interface CalendarGridProps {
  state: CalendarState
  disabled?: (val: Date) => boolean
}

function CalendarGrid({ state, disabled, ...props }: CalendarGridProps) {
  const locale = useLocale() === "vi" ? "vi-VN" : "en-US"
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table
      {...gridProps}
      className={cn(gridProps.className, "w-full border-collapse space-y-1")}
    >
      <thead {...headerProps}>
        <tr className="flex">
          {weekDays.map((day, index) => (
            <th
              className="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
              key={index}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr className="mt-2 flex w-full" key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    disabled={disabled}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface CalendarCellProps {
  state: CalendarState
  date: CalendarDate
  disabled?: (val: Date) => boolean
}

function CalendarCell({ state, date, disabled }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref)

  const isToday = useMemo(() => {
    const timezone = getLocalTimeZone()
    return _isToday(date, timezone)
  }, [date])

  const isDisabled2 = useMemo(() => {
    const timezone = getLocalTimeZone()
    if (!disabled) return false
    return disabled(date.toDate(timezone))
  }, [date, disabled])

  return (
    <td
      {...cellProps}
      className={cn(
        cellProps.className,
        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
      )}
    >
      <Button
        {...buttonProps}
        type="button"
        variant={"ghost"}
        ref={ref}
        disabled={isDisabled2}
        className={cn(
          buttonProps.className,
          "size-9",
          isToday ? "bg-accent text-accent-foreground" : "",
          isSelected
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
            : "",
          isOutsideVisibleRange ? "text-muted-foreground opacity-50" : "",
          isDisabled2 || isDisabled ? "text-muted-foreground opacity-50" : ""
        )}
      >
        {formattedDate}
      </Button>
    </td>
  )
}

export { Calendar }

const DateTimePicker = React.forwardRef<
  HTMLDivElement,
  DatePickerStateOptions<DateValue> & { disabled?: (val: Date) => boolean }
>((props, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)

  const state = useDatePickerState(props)
  const {
    groupProps,
    fieldProps,
    buttonProps: _buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref)
  const { buttonProps } = useButton(_buttonProps, buttonRef)
  useInteractOutside({
    ref: contentRef,
    onInteractOutside: (_e) => {
      setOpen(false)
    },
  })

  return (
    <div
      {...groupProps}
      ref={ref}
      className={cn(
        groupProps.className,
        "flex w-full items-center rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}
    >
      <DateField {...fieldProps} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            variant="outline"
            className="h-10 rounded-l-none"
            disabled={props.isDisabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={contentRef} className="w-full">
          <div {...dialogProps} className="space-y-3">
            <Calendar {...calendarProps} disabled={props.disabled} />
            {!!state.hasTime && (
              <TimeField
                value={state.timeValue}
                // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/ban-ts-comment
                //@ts-ignore
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onChange={state.setTimeValue}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})

DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker }

export const createCalendarDate = (date: Date | undefined | null) => {
  if (!date) return undefined

  const val = new Date(date)
  return new CalendarDate(val.getFullYear(), val.getMonth() + 1, val.getDate())
}
