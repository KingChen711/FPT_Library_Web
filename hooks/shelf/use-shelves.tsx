import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Floor,
  type Section,
  type Shelf,
  type Zone,
} from "@/lib/types/models"

type Props = {
  libraryItemId: number | null | undefined
  isMostAppropriate: boolean
  isChildrenSection?: boolean
  isReferenceSection?: boolean
  isJournalSection?: boolean
}

type Response = {
  itemClassificationNumber: string
  floor: Floor
  zone: Zone
  section: Section
  libraryShelves: Shelf[]
}

const defaultResponse: Response = {
  itemClassificationNumber: "",
  floor: {
    floorId: 0,
    createDate: new Date(),
    floorNumber: "1",
    isDeleted: false,
    updateDate: new Date(),
  },
  zone: {
    floorId: 0,
    createDate: new Date(),
    isDeleted: false,
    engDescription: "",
    engZoneName: "",
    totalCount: 0,
    vieDescription: "",
    vieZoneName: "",
    zoneId: 0,
    updateDate: null,
  },
  section: {
    classificationNumberRangeFrom: 0,
    classificationNumberRangeTo: 0,
    createDate: new Date(),
    engSectionName: "",
    isChildrenSection: false,
    isDeleted: false,
    isJournalSection: false,
    isReferenceSection: false,
    sectionId: 0,
    shelfPrefix: "",
    updateDate: null,
    vieSectionName: "",
    zoneId: 0,
  },
  libraryShelves: [],
}

function useShelves({
  isMostAppropriate,
  libraryItemId,
  isChildrenSection,
  isJournalSection,
  isReferenceSection,
}: Props) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [
      "shelves",
      {
        isMostAppropriate,
        libraryItemId,
        isChildrenSection,
        isJournalSection,
        isReferenceSection,
      },
      accessToken,
    ],
    queryFn: async (): Promise<Response> => {
      try {
        const { data } = await http.get<Response>(
          `/api/management/library-items/${libraryItemId}/get-shelf`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              isMostAppropriate,
              libraryItemId,
              isChildrenSection,
              isJournalSection,
              isReferenceSection,
            },
          }
        )
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          {
            ...data,
            libraryShelves: data.libraryShelves.sort(
              (a, b) =>
                a.classificationNumberRangeFrom -
                b.classificationNumberRangeFrom
            ),
          } || defaultResponse
        )
      } catch {
        return defaultResponse
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useShelves
