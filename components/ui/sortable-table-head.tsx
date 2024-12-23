"use client"

import React, { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react"

import { cn, formUrlQuery } from "@/lib/utils"

import { TableHead } from "./table"

type Props = {
  label: string
  sortKey: string
  currentSort: string | undefined
  position?: "left" | "center" | "right"
}

function SortableTableHead({
  currentSort,
  label,
  sortKey,
  position = "left",
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = () => {
    if (currentSort === sortKey) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        updates: {
          sort: `-${sortKey}`,
          pageIndex: "1",
        },
      })

      return router.replace(newUrl, { scroll: false })
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        sort: sortKey,
        pageIndex: "1",
      },
    })

    return router.replace(newUrl, { scroll: false })
  }

  const Icon = useCallback(() => {
    return currentSort === sortKey ? (
      <ChevronsUp className="ml-1 size-4" />
    ) : currentSort === `-${sortKey}` ? (
      <ChevronsDown className="ml-1 size-4" />
    ) : (
      <ChevronsUpDown className="ml-1 size-4" />
    )
  }, [currentSort, sortKey])

  return (
    <TableHead onClick={handleSort} className="cursor-pointer">
      <div
        className={cn(
          "flex items-center",
          position === "center" && "justify-center",
          position === "right" && "justify-end",
          currentSort?.includes(sortKey) && "text-primary"
        )}
      >
        <p className="select-none text-nowrap font-bold">{label}</p>
        <Icon />
      </div>
    </TableHead>
  )
}

export default SortableTableHead
// import { useNavigate } from '@tanstack/react-router'
// import { ChevronsDown, ChevronsUp, ChevronsUpDown } from 'lucide-react'
// import { useCallback } from 'react'

// type Props = {
//   key:
//     | 'code'
//     | 'email'
//     | 'fullName'
//     | 'bornYear'
//     | 'phone'
//     | 'name'
//     | 'createdAt'
//     | 'startDate'
//     | 'endDate'
//     | 'conditionPoint'
//     | 'duration'
//     | 'appliedJob'
//     | 'candidateName'
//     | 'recruitmentDrive'

//   sortParams: string | undefined
// }

// function useSort({ key, sortParams }: Props) {
//   const navigate = useNavigate()

//   const sorter = () => {
//     if (sortParams === key) {
//       return navigate({
//         search: (search) => ({
//           ...search,
//           sort: `-${key}`,
//           pageNumber: 1
//         })
//       })
//     }

//     return navigate({
//       search: (search) => ({
//         ...search,
//         sort: key,
//         pageNumber: 1
//       })
//     })
//   }

//   const Icon = useCallback(() => {
//     return sortParams === key ? (
//       <ChevronsUp className='ml-1 size-4' />
//     ) : sortParams === `-${key}` ? (
//       <ChevronsDown className='ml-1 size-4' />
//     ) : (
//       <ChevronsUpDown className='ml-1 size-4' />
//     )
//   }, [sortParams])

//   return { Icon, sorter }
// }

// export default useSort
