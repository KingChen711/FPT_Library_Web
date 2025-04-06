import React from "react"

const data = {
  sources: [
    {
      queueId: 3,
      libraryItemId: 21,
      libraryItemInstanceId: null,
      libraryCardId: "a9f94990-3b0d-f011-929c-346f24123636",
      queueStatus: 0,
      borrowRequestId: 8,
      isReservedAfterRequestFailed: true,
      expectedAvailableDateMin: null,
      expectedAvailableDateMax: null,
      reservationDate: "2025-04-01T11:04:23.787",
      expiryDate: null,
      reservationCode: null,
      isAppliedLabel: false,
      collectedDate: null,
      assignedDate: null,
      totalExtendPickup: 0,
      isNotified: false,
      cancelledBy: null,
      cancellationReason: null,
      libraryItem: {
        libraryItemId: 21,
        title: "Thám tử lừng danh Conan - Tập 5",
        subTitle: "Hung thủ thứ 2",
        responsibility: "Gosho Aoyama",
        edition: null,
        editionNumber: 1,
        language: "vie",
        originLanguage: "jpn",
        summary: "Cuộc phiêu lưu của Conan trong Tập 5.",
        coverImage:
          "https://res.cloudinary.com/dchmztiqg/image/upload/v1743322025/05b0102b-1098-4cc1-b94b-f987c421003b.jpg",
        publicationYear: 1994,
        publisher: "Nhà Xuất Bản Kim Đồng",
        publicationPlace: "Hà Nội",
        classificationNumber: "895.9223",
        cutterNumber: "TH104T",
        isbn: "9785859899869",
        ean: null,
        estimatedPrice: 50000.0,
        pageCount: 200,
        physicalDetails: "Bìa mềm",
        dimensions: "18 cm",
        accompanyingMaterial: null,
        genres: "Văn học thiếu nhi, Nhật Bản, Truyện tranh",
        generalNote: "Truyện trinh thám nổi tiếng của Gosho Aoyama.",
        bibliographicalNote: null,
        topicalTerms: "Thám tử, Phiêu lưu, Truyện trinh thám",
        additionalAuthors: null,
        categoryId: 2,
        shelfId: 21,
        groupId: 4,
        status: 1,
        isDeleted: false,
        canBorrow: false,
        isTrained: true,
        trainedAt: "2025-04-01T17:14:00.67",
        createdAt: "2025-03-30T15:07:46.937",
        updatedAt: "2025-04-01T17:14:00.67",
        createdBy: "librarian@gmail.com",
        updatedBy: "system",
        category: null,
        shelf: null,
        libraryItemGroup: null,
        libraryItemInventory: {
          libraryItemId: 21,
          totalUnits: 0,
          availableUnits: 0,
          requestUnits: 0,
          borrowedUnits: 0,
          reservedUnits: 2,
          lostUnits: 0,
          totalInShelfUnits: 0,
          totalInWarehouseUnits: 0,
        },
        libraryItemInstances: [],
        libraryItemAuthors: [],
        libraryItemResources: [],
      },
      libraryItemInstance: null,
      libraryCard: {
        libraryCardId: "a9f94990-3b0d-f011-929c-346f24123636",
        fullName: "Xuan Phuoc",
        avatar:
          "https://img.freepik.com/free-photo/serious-young-african-man-standing-isolated_171337-9633.jpg",
        barcode: "EC-97B5039D8EB1",
        issuanceMethod: 1,
        status: 5,
        isAllowBorrowMore: false,
        maxItemOnceTime: 0,
        allowBorrowMoreReason: null,
        totalMissedPickUp: 2,
        isReminderSent: true,
        isExtended: false,
        extensionCount: 0,
        issueDate: "2025-03-30T14:49:54.937",
        expiryDate: "2027-03-30T14:49:54.937",
        suspensionEndDate: "2025-05-06T18:47:09.463",
        suspensionReason: null,
        rejectReason: null,
        isArchived: false,
        archiveReason: null,
        previousUserId: null,
        transactionCode: "CODE149",
        previousUser: null,
      },
    },
  ],
  pageIndex: 1,
  pageSize: 15,
  totalPage: 1,
  totalActualItem: 1,
}

function AssignableReservationsSection() {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
        Đặt Chỗ Có Thể Gán
      </h2>
      <table className="min-w-full rounded-lg shadow-md">
        <thead>
          <tr className="">
            <th className="px-4 py-2 text-left">Mã Đặt Chỗ</th>
            <th className="px-4 py-2 text-left">Tiêu Đề Sách</th>
            <th className="px-4 py-2 text-left">Người Đặt</th>
            <th className="px-4 py-2 text-left">Ngày Đặt</th>
            <th className="px-4 py-2 text-left">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {data.sources.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.reservationCode || "N/A"}</td>
              <td className="px-4 py-2">{item.libraryItem.title}</td>
              <td className="px-4 py-2">{item.libraryCard.fullName}</td>
              <td className="px-4 py-2">
                {new Date(item.reservationDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-2">
                {item.queueStatus === 0 ? "Đang Chờ" : "Khác"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AssignableReservationsSection
