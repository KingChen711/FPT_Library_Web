import React from "react"

const data = {
  sources: [
    {
      borrowRecordDetail: {
        borrowRecordDetailId: 4,
        borrowRecordId: 2,
        libraryItemInstanceId: 10,
        imagePublicIds: null,
        conditionId: 1,
        returnConditionId: null,
        status: 2,
        dueDate: "2025-04-01T21:15:00.847",
        returnDate: null,
        conditionCheckDate: null,
        isReminderSent: true,
        totalExtension: 0,
        processedReturnBy: null,
        processedReturnByNavigation: null,
        libraryItemInstance: {
          libraryItemInstanceId: 10,
          libraryItemId: 3,
          barcode: "SD00010",
          status: "Borrowed",
          createdAt: "2025-03-30T14:49:54.453",
          updatedAt: "2025-04-01T20:16:31.727",
          createdBy: "system",
          updatedBy: "librarian@gmail.com",
          isDeleted: false,
          isCirculated: true,
          libraryItemConditionHistories: [],
        },
        condition: null,
        returnCondition: null,
        borrowDetailExtensionHistories: [],
        fines: [],
      },
      libraryCard: {
        libraryCardId: "03bac717-0e0e-f011-929c-346f24123636",
        fullName: "Le Xuan Phuoc",
        avatar:
          "https://res.cloudinary.com/dchmztiqg/image/upload/v1742381642/goku-fly_j9zgas.jpg",
        barcode: "EC-22A815471390",
        issuanceMethod: 0,
        status: 2,
        isAllowBorrowMore: false,
        maxItemOnceTime: 0,
        allowBorrowMoreReason: null,
        totalMissedPickUp: 1,
        isReminderSent: false,
        isExtended: false,
        extensionCount: 0,
        issueDate: "2025-03-31T15:56:52.89",
        expiryDate: "2025-09-30T15:56:52.89",
        suspensionEndDate: null,
        suspensionReason: null,
        rejectReason: null,
        isArchived: false,
        archiveReason: null,
        previousUserId: null,
        transactionCode: null,
        previousUser: null,
      },
      libraryItem: {
        libraryItemId: 3,
        title: "Harry Potter và phòng chứa bí mật",
        subTitle: "Harry Potter and the Chamber of Secrets",
        responsibility: "J. K. Rowling ; Lý Lan dịch",
        edition: null,
        editionNumber: 2,
        language: "vie",
        originLanguage: "eng",
        summary:
          "Câu chuyện phiêu lưu kỳ thú của Harry Potter tại trường Hogwarts khi khám phá bí mật về căn phòng bí mật.",
        coverImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrEKYtbqkEEP9yuSBRp_YL0BtqYo6ptzh2mg&s",
        publicationYear: 2025,
        publisher: "Nhà Xuất Bản Trẻ",
        publicationPlace: "Tp. Hồ Chí Minh",
        classificationNumber: "823",
        cutterNumber: "H109P",
        isbn: "9786041243958",
        ean: null,
        estimatedPrice: 170000.0,
        pageCount: 509,
        physicalDetails: "In lần thứ 56, bìa cứng",
        dimensions: "20 cm",
        accompanyingMaterial: null,
        genres: "Văn học thiếu nhi, Tiểu thuyết",
        generalNote: "Tập 2 trong loạt sách Harry Potter nổi tiếng.",
        bibliographicalNote: null,
        topicalTerms: "Văn học thiếu nhi, Phép thuật, Phiêu lưu",
        additionalAuthors: null,
        categoryId: 1,
        shelfId: 21,
        groupId: 1,
        status: 1,
        isDeleted: false,
        canBorrow: true,
        isTrained: false,
        trainedAt: null,
        createdAt: "2025-03-30T14:49:54.453",
        updatedAt: "2025-04-01T20:16:31.727",
        createdBy: "system",
        updatedBy: "librarian@gmail.com",
        category: null,
        shelf: null,
        libraryItemGroup: null,
        libraryItemInventory: null,
        libraryItemInstances: [
          {
            libraryItemInstanceId: 10,
            libraryItemId: 3,
            barcode: "SD00010",
            status: "Borrowed",
            createdAt: "2025-03-30T14:49:54.453",
            updatedAt: "2025-04-01T20:16:31.727",
            createdBy: "system",
            updatedBy: "librarian@gmail.com",
            isDeleted: false,
            isCirculated: true,
            libraryItemConditionHistories: [],
          },
        ],
        libraryItemAuthors: [
          {
            libraryItemAuthorId: 3,
            libraryItemId: 3,
            authorId: 8,
            createdAt: "2025-03-30T14:49:54.453",
            updatedAt: null,
            createdBy: "system",
            updatedBy: null,
            author: {
              authorId: 8,
              authorCode: "AUTH00008",
              authorImage:
                "https://www.jkrowling.com/wp-content/uploads/2022/05/J.K.-Rowling-2021-Photography-Debra-Hurford-Brown-scaled.jpg",
              fullName: "Rowling, J. K.",
              biography:
                "Joanne Rowling CH OBE FRSL, known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, a seven-volume fantasy series published from 1997 to 2007.",
              dob: "1965-07-31T00:00:00",
              dateOfDeath: null,
              nationality: "Gloucestershire, Anh",
              createDate: "2025-03-30T07:49:53.537",
              updateDate: null,
              isDeleted: false,
            },
          },
        ],
        libraryItemResources: [],
      },
    },
  ],
  pageIndex: 1,
  pageSize: 15,
  totalPage: 1,
  totalActualItem: 1,
}

function OverdueBorrowsSection() {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
        Mượn Quá Hạn
      </h2>
      <table className="min-w-full rounded-lg shadow-md">
        <thead>
          <tr className="">
            <th className="px-4 py-2 text-left">Người Mượn</th>
            <th className="px-4 py-2 text-left">Tiêu Đề Sách</th>
            <th className="px-4 py-2 text-left">Ngày Đến Hạn</th>
            <th className="px-4 py-2 text-left">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {data.sources.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.libraryCard.fullName}</td>
              <td className="px-4 py-2">{item.libraryItem.title}</td>
              <td className="px-4 py-2">
                {new Date(item.borrowRecordDetail.dueDate).toLocaleDateString(
                  "vi-VN"
                )}
              </td>
              <td className="px-4 py-2">
                {item.borrowRecordDetail.status === 2 ? "Quá Hạn" : "Khác"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OverdueBorrowsSection
