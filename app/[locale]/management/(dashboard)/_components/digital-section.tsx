import React from "react"

import StatCard from "./stat-card"

const data = {
  totalDigitalResource: 3,
  totalActiveDigitalBorrowing: 4,
  extensionRatePercentage: 50,
  averageExtensionsPerBorrow: 75,
  topBorrowLibraryResources: {
    sources: [
      {
        libraryResource: {
          resourceId: 2,
          resourceTitle: "Dac nhan tam",
          resourceType: "Ebook",
          resourceUrl:
            "https://res.cloudinary.com/dchmztiqg/image/upload/v1742392296/2ec05f28-e4ec-4ff2-ad14-3bb1c24490cd.pdf",
          resourceSize: 2000.0,
          fileFormat: "Image",
          provider: "Cloudinary",
          providerPublicId: "2ec05f28-e4ec-4ff2-ad14-3bb1c24490cd",
          providerMetadata: null,
          isDeleted: false,
          defaultBorrowDurationDays: 30,
          borrowPrice: 2000.0,
          createdAt: "2025-04-01T10:24:10.93",
          updatedAt: null,
          createdBy: "librarian@gmail.com",
          updatedBy: null,
        },
        totalBorrowed: 3,
        totalExtension: 2,
        averageBorrowDuration: 30,
        extensionRate: 66.66,
        lastBorrowDate: "2025-04-03T16:52:21.703",
      },
      {
        libraryResource: {
          resourceId: 3,
          resourceTitle: "Audio Harry 3",
          resourceType: "AudioBook",
          resourceUrl:
            "https://res.cloudinary.com/dchmztiqg/video/upload/v1742512392/eb8f57ea-4f34-4d8b-bb90-34695ce41a74.mp3",
          resourceSize: 2000.0,
          fileFormat: "Video",
          provider: "Cloudinary",
          providerPublicId: "eb8f57ea-4f34-4d8b-bb90-34695ce41a74",
          providerMetadata: null,
          isDeleted: false,
          defaultBorrowDurationDays: 30,
          borrowPrice: 3000.0,
          createdAt: "2025-04-03T16:53:15.89",
          updatedAt: null,
          createdBy: "librarian@gmail.com",
          updatedBy: null,
        },
        totalBorrowed: 1,
        totalExtension: 1,
        averageBorrowDuration: 60,
        extensionRate: 100,
        lastBorrowDate: "2025-04-03T16:56:16.303",
      },
      {
        libraryResource: {
          resourceId: 1,
          resourceTitle: "ABC2",
          resourceType: "AudioBook",
          resourceUrl:
            "https://res.cloudinary.com/dchmztiqg/image/upload/v1742460479/3b7b84ad-c4a4-4329-9612-0955cd850b27.pdf",
          resourceSize: 2000.0,
          fileFormat: "Image",
          provider: "Cloudinary",
          providerPublicId: "3b7b84ad-c4a4-4329-9612-0955cd850b27",
          providerMetadata: null,
          isDeleted: false,
          defaultBorrowDurationDays: 30,
          borrowPrice: 2000.0,
          createdAt: "2025-03-31T23:41:27.843",
          updatedAt: null,
          createdBy: "librarian@gmail.com",
          updatedBy: null,
        },
        totalBorrowed: 0,
        totalExtension: 0,
        averageBorrowDuration: 0,
        extensionRate: 0,
        lastBorrowDate: null,
      },
    ],
    pageIndex: 1,
    pageSize: 3,
    totalPage: 1,
    totalActualItem: 3,
  },
}

function DigitalResourcesSection() {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-muted-foreground">
        Phân Tích Tài Nguyên Số
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng Tài Nguyên Số"
          value={data.totalDigitalResource}
        />
        <StatCard
          title="Mượn Đang Hoạt Động"
          value={data.totalActiveDigitalBorrowing}
        />
        <StatCard
          title="Tỷ Lệ Gia Hạn"
          value={`${data.extensionRatePercentage}%`}
        />
        <StatCard
          title="Số Gia Hạn Trung Bình"
          value={data.averageExtensionsPerBorrow}
        />
      </div>

      <h3 className="mb-2 text-lg font-medium text-muted-foreground">
        Top Tài Nguyên Được Mượn
      </h3>
      <table className="min-w-full rounded-lg shadow-md">
        <thead>
          <tr className="">
            <th className="px-4 py-2 text-left">Tiêu Đề</th>
            <th className="px-4 py-2 text-left">Loại</th>
            <th className="px-4 py-2 text-left">Tổng Số Lần Mượn</th>
            <th className="px-4 py-2 text-left">Tỷ Lệ Gia Hạn</th>
          </tr>
        </thead>
        <tbody>
          {data.topBorrowLibraryResources.sources.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">
                {item.libraryResource.resourceTitle}
              </td>
              <td className="px-4 py-2">{item.libraryResource.resourceType}</td>
              <td className="px-4 py-2">{item.totalBorrowed}</td>
              <td className="px-4 py-2">{item.extensionRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DigitalResourcesSection
