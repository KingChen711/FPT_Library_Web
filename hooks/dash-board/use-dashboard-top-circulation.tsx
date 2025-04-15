import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import { type BookEdition, type Category } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"

export type TDashboardTopCirculation = {
  availableVsNeedChart: {
    availableUnits: number
    needUnits: number
  }
  topBorrowItems: Pagination<
    {
      borrowSuccessCount: number
      borrowFailedCount: number
      reserveCount: number
      extendedBorrowCount: number
      digitalBorrowCount: number
      borrowFailedRate: number
      borrowExtensionRate: number
      libraryItem: BookEdition & { category: Category }
      availableVsNeedChart: {
        averageNeedSatisfactionRate: number
        availableUnits: number
        needUnits: number
      }
      borrowTrends: { periodLabel: string; value: number }[]
      reservationTrends: { periodLabel: string; value: number }[]
    }[]
  >
}

export type TopCirculationSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
}

const defaultRes: TDashboardTopCirculation = {
  availableVsNeedChart: {
    availableUnits: 0,
    needUnits: 0,
  },
  topBorrowItems: {
    pageIndex: 0,
    pageSize: 0,
    sources: [],
    totalActualItem: 0,
    totalPage: 0,
  },
}

function useDashboardTopCirculation(
  searchParams: TopCirculationSearchParams & TSearchTopCirculation
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/top-circulation", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardTopCirculation> => {
      if (!accessToken) return defaultRes
      try {
        const { data } = await http.get<TDashboardTopCirculation>(
          `/api/management/dashboard/top-circulation-items`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              startDate: searchParams.startDate
                ? format(searchParams.startDate, "yyyy-MM-dd")
                : "",
              endDate: searchParams.endDate
                ? format(searchParams.endDate, "yyyy-MM-dd")
                : "",
            },
          }
        )

        return data || defaultRes
      } catch {
        return defaultRes
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useDashboardTopCirculation

// {
//   "topBorrowItems": {
//       "sources": [
//           {
//               "libraryItem": {
//                   "libraryItemId": 21,
//                   "title": "Thám tử lừng danh Conan - Tập 5",
//                   "subTitle": "Hung thủ thứ 2",
//                   "responsibility": "Gosho Aoyama",
//                   "edition": null,
//                   "editionNumber": 1,
//                   "language": "vie",
//                   "originLanguage": "jpn",
//                   "summary": "Cuộc phiêu lưu của Conan trong Tập 5.",
//                   "coverImage": "https://res.cloudinary.com/dchmztiqg/image/upload/v1743322025/05b0102b-1098-4cc1-b94b-f987c421003b.jpg",
//                   "publicationYear": 1994,
//                   "publisher": "Nhà Xuất Bản Kim Đồng",
//                   "publicationPlace": "Hà Nội",
//                   "classificationNumber": "895.9223",
//                   "cutterNumber": "TH104T",
//                   "isbn": "9785859899869",
//                   "ean": null,
//                   "estimatedPrice": 50000.00,
//                   "pageCount": 200,
//                   "physicalDetails": "Bìa mềm",
//                   "dimensions": "18 cm",
//                   "accompanyingMaterial": null,
//                   "genres": "Văn học thiếu nhi, Nhật Bản, Truyện tranh",
//                   "generalNote": "Truyện trinh thám nổi tiếng của Gosho Aoyama.",
//                   "bibliographicalNote": null,
//                   "topicalTerms": "Thám tử, Phiêu lưu, Truyện trinh thám",
//                   "additionalAuthors": null,
//                   "categoryId": 2,
//                   "shelfId": 21,
//                   "groupId": 4,
//                   "status": 1,
//                   "isDeleted": false,
//                   "canBorrow": false,
//                   "isTrained": true,
//                   "trainedAt": "2025-04-01T17:14:00.67",
//                   "createdAt": "2025-03-30T15:07:46.937",
//                   "updatedAt": "2025-04-01T17:14:00.67",
//                   "createdBy": "librarian@gmail.com",
//                   "updatedBy": "system",
//                   "avgReviewedRate": 0,
//                   "category": {
//                       "categoryId": 2,
//                       "prefix": "SB",
//                       "englishName": "BookSeries",
//                       "vietnameseName": "Sách bộ",
//                       "description": null,
//                       "isAllowAITraining": true,
//                       "totalBorrowDays": 30
//                   },
//                   "shelf": {
//                       "shelfId": 21,
//                       "sectionId": 3,
//                       "shelfNumber": "C-05",
//                       "engShelfName": "Arts, Recreation & Children's Literature",
//                       "vieShelfName": "Nghệ thuật, Giải trí & Văn học thiếu nhi",
//                       "classificationNumberRangeFrom": 700,
//                       "classificationNumberRangeTo": 899,
//                       "createDate": "2025-03-30T14:49:53.76",
//                       "updateDate": null,
//                       "isDeleted": false
//                   },
//                   "libraryItemGroup": null,
//                   "libraryItemInventory": {
//                       "libraryItemId": 21,
//                       "totalUnits": 0,
//                       "availableUnits": 0,
//                       "requestUnits": 0,
//                       "borrowedUnits": 0,
//                       "reservedUnits": 2,
//                       "lostUnits": 0,
//                       "totalInShelfUnits": 0,
//                       "totalInWarehouseUnits": 0
//                   },
//                   "resources": [],
//                   "authors": [
//                       {
//                           "authorId": 9,
//                           "authorCode": "AUTH00009",
//                           "authorImage": "https://media.baoquangninh.vn/upload/image/202407/medium/2231419_6dea9ae532595ef6080e0db2bdb446a6.jpg",
//                           "fullName": "Aoyama Gosho",
//                           "biography": "Gosho Aoyama là một họa sĩ truyện tranh nổi tiếng, được biết đến nhiều nhất với việc tạo ra loạt truyện trinh thám 'Thám tử lừng danh Conan'. Bộ truyện, được ra mắt vào năm 1994, đã trở thành một trong những series truyện tranh bán chạy nhất từ trước đến nay.",
//                           "dob": "1963-06-21T00:00:00",
//                           "dateOfDeath": null,
//                           "nationality": "Nhật Bản",
//                           "createDate": "2025-03-30T07:49:53.537",
//                           "updateDate": null,
//                           "isDeleted": false
//                       }
//                   ],
//                   "libraryItemInstances": [],
//                   "digitalBorrows": [],
//                   "libraryItemReviews": []
//               },
//               "borrowSuccessCount": 0,
//               "borrowFailedCount": 1,
//               "reserveCount": 1,
//               "extendedBorrowCount": 0,
//               "digitalBorrowCount": 0,
//               "borrowFailedRate": 100,
//               "borrowExtensionRate": 0,
//               "availableVsNeedChart": {
//                   "averageNeedSatisfactionRate": 0,
//                   "availableUnits": 0,
//                   "needUnits": 2
//               },
//               "borrowTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ],
//               "reservationTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 1
//                   }
//               ]
//           },
//           {
//               "libraryItem": {
//                   "libraryItemId": 85,
//                   "title": "Cô gái đến từ hôm qua",
//                   "subTitle": null,
//                   "responsibility": "Nguyễn Nhật Ánh",
//                   "edition": "In lần thứ 62",
//                   "editionNumber": null,
//                   "language": "vie",
//                   "originLanguage": null,
//                   "summary": null,
//                   "coverImage": "https://res.cloudinary.com/dchmztiqg/image/upload/v1743376605/03d1fc93-a409-4a86-8fe5-c76ca4e02be3.jpg",
//                   "publicationYear": 2024,
//                   "publisher": "Nxb. Trẻ",
//                   "publicationPlace": "Tp. Hồ Chí Minh",
//                   "classificationNumber": "895.922334",
//                   "cutterNumber": "C450G",
//                   "isbn": "9786041218253",
//                   "ean": null,
//                   "estimatedPrice": 85000.00,
//                   "pageCount": 221,
//                   "physicalDetails": "tranh vẽ",
//                   "dimensions": "20 cm",
//                   "accompanyingMaterial": null,
//                   "genres": "Truyện dài",
//                   "generalNote": null,
//                   "bibliographicalNote": null,
//                   "topicalTerms": "Văn học hiện đại",
//                   "additionalAuthors": null,
//                   "categoryId": 1,
//                   "shelfId": 21,
//                   "groupId": null,
//                   "status": 1,
//                   "isDeleted": false,
//                   "canBorrow": false,
//                   "isTrained": false,
//                   "trainedAt": null,
//                   "createdAt": "2025-03-31T06:20:17.55",
//                   "updatedAt": "2025-04-02T16:20:59.417",
//                   "createdBy": "librarian@gmail.com",
//                   "updatedBy": "librarian@gmail.com",
//                   "avgReviewedRate": 0,
//                   "category": {
//                       "categoryId": 1,
//                       "prefix": "SD",
//                       "englishName": "SingleBook",
//                       "vietnameseName": "Sách đơn",
//                       "description": null,
//                       "isAllowAITraining": true,
//                       "totalBorrowDays": 30
//                   },
//                   "shelf": {
//                       "shelfId": 21,
//                       "sectionId": 3,
//                       "shelfNumber": "C-05",
//                       "engShelfName": "Arts, Recreation & Children's Literature",
//                       "vieShelfName": "Nghệ thuật, Giải trí & Văn học thiếu nhi",
//                       "classificationNumberRangeFrom": 700,
//                       "classificationNumberRangeTo": 899,
//                       "createDate": "2025-03-30T14:49:53.76",
//                       "updateDate": null,
//                       "isDeleted": false
//                   },
//                   "libraryItemGroup": null,
//                   "libraryItemInventory": {
//                       "libraryItemId": 85,
//                       "totalUnits": 3,
//                       "availableUnits": 1,
//                       "requestUnits": 0,
//                       "borrowedUnits": 0,
//                       "reservedUnits": 2,
//                       "lostUnits": 0,
//                       "totalInShelfUnits": 0,
//                       "totalInWarehouseUnits": 0
//                   },
//                   "resources": [],
//                   "authors": [
//                       {
//                           "authorId": 26,
//                           "authorCode": "AUTH00026",
//                           "authorImage": null,
//                           "fullName": "Nguyễn Nhật Ánh",
//                           "biography": "<p>Nguyễn Nhật Ánh (sinh ngày 7 tháng 5 năm 1955) là một tác giả văn học thiếu nhi người Việt, nổi tiếng với tiểu thuyết <i>Mắt biếc</i> và nhiều tác phẩm được yêu thích khác.</p>",
//                           "dob": "1955-05-07T00:00:00",
//                           "dateOfDeath": null,
//                           "nationality": "Việt Nam",
//                           "createDate": "2025-03-30T14:49:53.537",
//                           "updateDate": null,
//                           "isDeleted": false
//                       }
//                   ],
//                   "libraryItemInstances": [],
//                   "digitalBorrows": [],
//                   "libraryItemReviews": []
//               },
//               "borrowSuccessCount": 0,
//               "borrowFailedCount": 0,
//               "reserveCount": 0,
//               "extendedBorrowCount": 0,
//               "digitalBorrowCount": 0,
//               "borrowFailedRate": 0,
//               "borrowExtensionRate": 0,
//               "availableVsNeedChart": {
//                   "averageNeedSatisfactionRate": 50,
//                   "availableUnits": 1,
//                   "needUnits": 2
//               },
//               "borrowTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ],
//               "reservationTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ]
//           },
//           {
//               "libraryItem": {
//                   "libraryItemId": 2,
//                   "title": "Harry Potter và phòng chứa bí mật",
//                   "subTitle": "Harry Potter and the Chamber of Secrets",
//                   "responsibility": "J. K. Rowling ; Lý Lan dịch",
//                   "edition": null,
//                   "editionNumber": 1,
//                   "language": "vie",
//                   "originLanguage": "eng",
//                   "summary": "Câu chuyện phiêu lưu kỳ thú của Harry Potter tại trường Hogwarts khi khám phá bí mật về căn phòng bí mật.",
//                   "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrEKYtbqkEEP9yuSBRp_YL0BtqYo6ptzh2mg&s",
//                   "publicationYear": 2024,
//                   "publisher": "Nhà Xuất Bản Trẻ",
//                   "publicationPlace": "Tp. Hồ Chí Minh",
//                   "classificationNumber": "823",
//                   "cutterNumber": "H109P",
//                   "isbn": "9780395453100",
//                   "ean": null,
//                   "estimatedPrice": 170000.00,
//                   "pageCount": 429,
//                   "physicalDetails": "In lần thứ 56, bìa cứng",
//                   "dimensions": "20 cm",
//                   "accompanyingMaterial": null,
//                   "genres": "Văn học thiếu nhi, Tiểu thuyết",
//                   "generalNote": "Tập 2 trong loạt sách Harry Potter nổi tiếng.",
//                   "bibliographicalNote": null,
//                   "topicalTerms": "Văn học thiếu nhi, Phép thuật, Phiêu lưu",
//                   "additionalAuthors": null,
//                   "categoryId": 1,
//                   "shelfId": 21,
//                   "groupId": 1,
//                   "status": 1,
//                   "isDeleted": false,
//                   "canBorrow": false,
//                   "isTrained": false,
//                   "trainedAt": null,
//                   "createdAt": "2025-03-30T14:49:54.453",
//                   "updatedAt": "2025-04-02T19:50:26.6",
//                   "createdBy": "system",
//                   "updatedBy": "librarian@gmail.com",
//                   "avgReviewedRate": 0,
//                   "category": {
//                       "categoryId": 1,
//                       "prefix": "SD",
//                       "englishName": "SingleBook",
//                       "vietnameseName": "Sách đơn",
//                       "description": null,
//                       "isAllowAITraining": true,
//                       "totalBorrowDays": 30
//                   },
//                   "shelf": {
//                       "shelfId": 21,
//                       "sectionId": 3,
//                       "shelfNumber": "C-05",
//                       "engShelfName": "Arts, Recreation & Children's Literature",
//                       "vieShelfName": "Nghệ thuật, Giải trí & Văn học thiếu nhi",
//                       "classificationNumberRangeFrom": 700,
//                       "classificationNumberRangeTo": 899,
//                       "createDate": "2025-03-30T14:49:53.76",
//                       "updateDate": null,
//                       "isDeleted": false
//                   },
//                   "libraryItemGroup": null,
//                   "libraryItemInventory": {
//                       "libraryItemId": 2,
//                       "totalUnits": 5,
//                       "availableUnits": 0,
//                       "requestUnits": 0,
//                       "borrowedUnits": 0,
//                       "reservedUnits": 0,
//                       "lostUnits": 0,
//                       "totalInShelfUnits": 0,
//                       "totalInWarehouseUnits": 0
//                   },
//                   "resources": [],
//                   "authors": [
//                       {
//                           "authorId": 8,
//                           "authorCode": "AUTH00008",
//                           "authorImage": "https://www.jkrowling.com/wp-content/uploads/2022/05/J.K.-Rowling-2021-Photography-Debra-Hurford-Brown-scaled.jpg",
//                           "fullName": "Rowling, J. K.",
//                           "biography": "Joanne Rowling CH OBE FRSL, known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, a seven-volume fantasy series published from 1997 to 2007.",
//                           "dob": "1965-07-31T00:00:00",
//                           "dateOfDeath": null,
//                           "nationality": "Gloucestershire, Anh",
//                           "createDate": "2025-03-30T07:49:53.537",
//                           "updateDate": null,
//                           "isDeleted": false
//                       }
//                   ],
//                   "libraryItemInstances": [],
//                   "digitalBorrows": [],
//                   "libraryItemReviews": []
//               },
//               "borrowSuccessCount": 1,
//               "borrowFailedCount": 1,
//               "reserveCount": 0,
//               "extendedBorrowCount": 0,
//               "digitalBorrowCount": 0,
//               "borrowFailedRate": 50,
//               "borrowExtensionRate": 0,
//               "availableVsNeedChart": {
//                   "averageNeedSatisfactionRate": 100,
//                   "availableUnits": 0,
//                   "needUnits": 0
//               },
//               "borrowTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 1
//                   }
//               ],
//               "reservationTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 1
//                   }
//               ]
//           },
//           {
//               "libraryItem": {
//                   "libraryItemId": 3,
//                   "title": "Harry Potter và phòng chứa bí mật",
//                   "subTitle": "Harry Potter and the Chamber of Secrets",
//                   "responsibility": "J. K. Rowling ; Lý Lan dịch",
//                   "edition": null,
//                   "editionNumber": 2,
//                   "language": "vie",
//                   "originLanguage": "eng",
//                   "summary": "Câu chuyện phiêu lưu kỳ thú của Harry Potter tại trường Hogwarts khi khám phá bí mật về căn phòng bí mật.",
//                   "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrEKYtbqkEEP9yuSBRp_YL0BtqYo6ptzh2mg&s",
//                   "publicationYear": 2025,
//                   "publisher": "Nhà Xuất Bản Trẻ",
//                   "publicationPlace": "Tp. Hồ Chí Minh",
//                   "classificationNumber": "823",
//                   "cutterNumber": "H109P",
//                   "isbn": "9786041243958",
//                   "ean": null,
//                   "estimatedPrice": 170000.00,
//                   "pageCount": 509,
//                   "physicalDetails": "In lần thứ 56, bìa cứng",
//                   "dimensions": "20 cm",
//                   "accompanyingMaterial": null,
//                   "genres": "Văn học thiếu nhi, Tiểu thuyết",
//                   "generalNote": "Tập 2 trong loạt sách Harry Potter nổi tiếng.",
//                   "bibliographicalNote": null,
//                   "topicalTerms": "Văn học thiếu nhi, Phép thuật, Phiêu lưu",
//                   "additionalAuthors": null,
//                   "categoryId": 1,
//                   "shelfId": 21,
//                   "groupId": 1,
//                   "status": 1,
//                   "isDeleted": false,
//                   "canBorrow": true,
//                   "isTrained": false,
//                   "trainedAt": null,
//                   "createdAt": "2025-03-30T14:49:54.453",
//                   "updatedAt": "2025-04-01T20:16:31.727",
//                   "createdBy": "system",
//                   "updatedBy": "librarian@gmail.com",
//                   "avgReviewedRate": 4,
//                   "category": {
//                       "categoryId": 1,
//                       "prefix": "SD",
//                       "englishName": "SingleBook",
//                       "vietnameseName": "Sách đơn",
//                       "description": null,
//                       "isAllowAITraining": true,
//                       "totalBorrowDays": 30
//                   },
//                   "shelf": {
//                       "shelfId": 21,
//                       "sectionId": 3,
//                       "shelfNumber": "C-05",
//                       "engShelfName": "Arts, Recreation & Children's Literature",
//                       "vieShelfName": "Nghệ thuật, Giải trí & Văn học thiếu nhi",
//                       "classificationNumberRangeFrom": 700,
//                       "classificationNumberRangeTo": 899,
//                       "createDate": "2025-03-30T14:49:53.76",
//                       "updateDate": null,
//                       "isDeleted": false
//                   },
//                   "libraryItemGroup": null,
//                   "libraryItemInventory": {
//                       "libraryItemId": 3,
//                       "totalUnits": 5,
//                       "availableUnits": 2,
//                       "requestUnits": 1,
//                       "borrowedUnits": 1,
//                       "reservedUnits": 0,
//                       "lostUnits": 0,
//                       "totalInShelfUnits": 0,
//                       "totalInWarehouseUnits": 0
//                   },
//                   "resources": [],
//                   "authors": [
//                       {
//                           "authorId": 8,
//                           "authorCode": "AUTH00008",
//                           "authorImage": "https://www.jkrowling.com/wp-content/uploads/2022/05/J.K.-Rowling-2021-Photography-Debra-Hurford-Brown-scaled.jpg",
//                           "fullName": "Rowling, J. K.",
//                           "biography": "Joanne Rowling CH OBE FRSL, known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, a seven-volume fantasy series published from 1997 to 2007.",
//                           "dob": "1965-07-31T00:00:00",
//                           "dateOfDeath": null,
//                           "nationality": "Gloucestershire, Anh",
//                           "createDate": "2025-03-30T07:49:53.537",
//                           "updateDate": null,
//                           "isDeleted": false
//                       }
//                   ],
//                   "libraryItemInstances": [],
//                   "digitalBorrows": [],
//                   "libraryItemReviews": [
//                       {
//                           "reviewId": 474,
//                           "libraryItemId": 3,
//                           "userId": "a2f94990-3b0d-f011-929c-346f24123636",
//                           "ratingValue": 4,
//                           "reviewText": null,
//                           "createDate": "2025-04-01T09:51:48.017",
//                           "updatedDate": null,
//                           "user": null
//                       }
//                   ]
//               },
//               "borrowSuccessCount": 1,
//               "borrowFailedCount": 0,
//               "reserveCount": 0,
//               "extendedBorrowCount": 0,
//               "digitalBorrowCount": 3,
//               "borrowFailedRate": 0,
//               "borrowExtensionRate": 0,
//               "availableVsNeedChart": {
//                   "averageNeedSatisfactionRate": 100,
//                   "availableUnits": 2,
//                   "needUnits": 0
//               },
//               "borrowTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 1
//                   }
//               ],
//               "reservationTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ]
//           },
//           {
//               "libraryItem": {
//                   "libraryItemId": 17,
//                   "title": "Thám tử lừng danh Conan - Tập 1",
//                   "subTitle": "Sherlock Holmes Nhật Bản",
//                   "responsibility": "Gosho Aoyama",
//                   "edition": null,
//                   "editionNumber": 1,
//                   "language": "vie",
//                   "originLanguage": "jpn",
//                   "summary": "Cuộc phiêu lưu của Conan trong Tập 1.",
//                   "coverImage": "https://res.cloudinary.com/dchmztiqg/image/upload/v1743322012/976a112a-fd4d-4f3f-ab1c-304c20e60c60.jpg",
//                   "publicationYear": 1994,
//                   "publisher": "Nhà Xuất Bản Kim Đồng",
//                   "publicationPlace": "Hà Nội",
//                   "classificationNumber": "895.9223",
//                   "cutterNumber": "TH104T",
//                   "isbn": "9782987400936",
//                   "ean": null,
//                   "estimatedPrice": 50000.00,
//                   "pageCount": 200,
//                   "physicalDetails": "Bìa mềm",
//                   "dimensions": "18 cm",
//                   "accompanyingMaterial": null,
//                   "genres": "Văn học thiếu nhi, Nhật Bản, Truyện tranh",
//                   "generalNote": "Truyện trinh thám nổi tiếng của Gosho Aoyama.",
//                   "bibliographicalNote": null,
//                   "topicalTerms": "Thám tử, Phiêu lưu, Truyện trinh thám",
//                   "additionalAuthors": null,
//                   "categoryId": 2,
//                   "shelfId": 21,
//                   "groupId": 4,
//                   "status": 1,
//                   "isDeleted": false,
//                   "canBorrow": true,
//                   "isTrained": true,
//                   "trainedAt": "2025-04-01T17:14:00.67",
//                   "createdAt": "2025-03-30T15:07:46.937",
//                   "updatedAt": "2025-04-01T17:14:00.67",
//                   "createdBy": "librarian@gmail.com",
//                   "updatedBy": "system",
//                   "avgReviewedRate": 0,
//                   "category": {
//                       "categoryId": 2,
//                       "prefix": "SB",
//                       "englishName": "BookSeries",
//                       "vietnameseName": "Sách bộ",
//                       "description": null,
//                       "isAllowAITraining": true,
//                       "totalBorrowDays": 30
//                   },
//                   "shelf": {
//                       "shelfId": 21,
//                       "sectionId": 3,
//                       "shelfNumber": "C-05",
//                       "engShelfName": "Arts, Recreation & Children's Literature",
//                       "vieShelfName": "Nghệ thuật, Giải trí & Văn học thiếu nhi",
//                       "classificationNumberRangeFrom": 700,
//                       "classificationNumberRangeTo": 899,
//                       "createDate": "2025-03-30T14:49:53.76",
//                       "updateDate": null,
//                       "isDeleted": false
//                   },
//                   "libraryItemGroup": null,
//                   "libraryItemInventory": {
//                       "libraryItemId": 17,
//                       "totalUnits": 5,
//                       "availableUnits": 4,
//                       "requestUnits": 0,
//                       "borrowedUnits": 1,
//                       "reservedUnits": 0,
//                       "lostUnits": 0,
//                       "totalInShelfUnits": 0,
//                       "totalInWarehouseUnits": 0
//                   },
//                   "resources": [],
//                   "authors": [
//                       {
//                           "authorId": 9,
//                           "authorCode": "AUTH00009",
//                           "authorImage": "https://media.baoquangninh.vn/upload/image/202407/medium/2231419_6dea9ae532595ef6080e0db2bdb446a6.jpg",
//                           "fullName": "Aoyama Gosho",
//                           "biography": "Gosho Aoyama là một họa sĩ truyện tranh nổi tiếng, được biết đến nhiều nhất với việc tạo ra loạt truyện trinh thám 'Thám tử lừng danh Conan'. Bộ truyện, được ra mắt vào năm 1994, đã trở thành một trong những series truyện tranh bán chạy nhất từ trước đến nay.",
//                           "dob": "1963-06-21T00:00:00",
//                           "dateOfDeath": null,
//                           "nationality": "Nhật Bản",
//                           "createDate": "2025-03-30T07:49:53.537",
//                           "updateDate": null,
//                           "isDeleted": false
//                       }
//                   ],
//                   "libraryItemInstances": [],
//                   "digitalBorrows": [],
//                   "libraryItemReviews": []
//               },
//               "borrowSuccessCount": 0,
//               "borrowFailedCount": 0,
//               "reserveCount": 0,
//               "extendedBorrowCount": 0,
//               "digitalBorrowCount": 1,
//               "borrowFailedRate": 0,
//               "borrowExtensionRate": 0,
//               "availableVsNeedChart": {
//                   "averageNeedSatisfactionRate": 100,
//                   "availableUnits": 4,
//                   "needUnits": 0
//               },
//               "borrowTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ],
//               "reservationTrends": [
//                   {
//                       "periodLabel": "04-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "05-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "06-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "07-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "08-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "09-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "10-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "11-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "12-2024",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "01-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "02-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "03-2025",
//                       "value": 0
//                   },
//                   {
//                       "periodLabel": "04-2025",
//                       "value": 0
//                   }
//               ]
//           }
//       ],
//       "pageIndex": 1,
//       "pageSize": 15,
//       "totalPage": 1,
//       "totalActualItem": 5
//   },
//   "availableVsNeedChart": {
//       "availableUnits": 7,
//       "needUnits": 4
//   }
// }
