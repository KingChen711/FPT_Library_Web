"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdvancedSearchTab from "@/components/book-filter-tabs/advanced-search-tab"
import BasicSearchTab from "@/components/book-filter-tabs/basic-search-tab"
import QuickSearchTab from "@/components/book-filter-tabs/quick-search-tab"

import SheetSearchBook from "./_components/sheet-search-book"

const SearchPage = () => {
  return (
    <div className="container flex size-full flex-col justify-center gap-4 p-12">
      <section className="flex-1 space-y-2">
        <h1 className="text-2xl font-semibold text-primary">
          Tìm kiếm các bài viết, sách, tạp chí và các nội dung khác
        </h1>
        <SheetSearchBook />

        <Tabs defaultValue="quick-search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-search">Quick search</TabsTrigger>
            <TabsTrigger value="basic-search">Basic search</TabsTrigger>
            <TabsTrigger value="advanced-search">Advanced search</TabsTrigger>
          </TabsList>
          <TabsContent value="quick-search">
            <QuickSearchTab />
          </TabsContent>
          <TabsContent value="basic-search">
            <BasicSearchTab />
          </TabsContent>
          <TabsContent value="advanced-search">
            <AdvancedSearchTab />
          </TabsContent>
        </Tabs>
      </section>

      <Separator />
      <div className="flex h-5 items-center justify-center space-x-4 text-sm">
        <div>Chính sách riêng tư</div>
        <Separator orientation="vertical" />
        <div>Điều khoản sử dụng</div>
        <Separator orientation="vertical" />
        <div>Đăng xuất theo tổ chức</div>
        <Separator orientation="vertical" />
        <div>Quản lí cookies của bạn</div>
      </div>
    </div>
  )
}

export default SearchPage
