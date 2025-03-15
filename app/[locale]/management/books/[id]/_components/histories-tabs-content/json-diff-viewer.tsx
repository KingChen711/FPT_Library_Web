"use client"

import { useMemo } from "react"
import { diffJson } from "diff"

import { cn } from "@/lib/utils"

interface JsonDiffViewerProps {
  oldValue: object | null
  newValue: object | null
}

export function JsonDiffViewer({ oldValue, newValue }: JsonDiffViewerProps) {
  const diff = useMemo(
    () => diffJson(oldValue || {}, newValue || {}),
    [oldValue, newValue]
  )

  return (
    <pre className="text-sm">
      {diff.map((part, index) => (
        <span
          key={index}
          className={cn(
            "text-wrap",
            part.added
              ? "bg-green-500/15 text-success"
              : part.removed
                ? "bg-red-500/15 text-danger"
                : ""
          )}
        >
          {part.value}
        </span>
      ))}
    </pre>
  )
}
