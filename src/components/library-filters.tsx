"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, Grid, List } from "lucide-react"

export function LibraryFilters({ categories }: { categories: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ดึงค่าปัจจุบันจาก URL
  const currentQuery = searchParams.get("query") || ""
  const currentCategory = searchParams.get("category") || "ALL"
  const currentSort = searchParams.get("sort") || "DATE_DESC"
  const currentView = searchParams.get("view") || "grid" // เพิ่มการอ่านค่า view

  // ฟังก์ชันอัปเดต URL
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "ALL" || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/books?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
      
      {/* ช่องค้นหา */}
      <div className="relative flex-1 min-w-[180px] max-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B6F5E]" />
        <input 
          type="text" 
          defaultValue={currentQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilter('query', e.currentTarget.value)
            }
          }}
          placeholder="ค้นหาชื่อ, ผู้แต่ง (กด Enter)..." 
          className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2 pl-9 pr-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A] placeholder:text-[#8B6F5E]/70 transition-colors"
        />
      </div>
      
      {/* ตัวกรองหมวดหมู่ */}
      <select 
        value={currentCategory}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="bg-white border border-[#D9D2C7] rounded-lg py-2 pl-3 pr-8 text-[12px] text-[#8B6F5E] outline-none focus:border-[#C07B5A] focus:text-[#5C4033] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%238B6F5E%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
      >
        <option value="ALL">All Categories</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      
      {/* ตัวเรียงลำดับ */}
      <select 
        value={currentSort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="bg-white border border-[#D9D2C7] rounded-lg py-2 pl-3 pr-8 text-[12px] text-[#8B6F5E] outline-none focus:border-[#C07B5A] focus:text-[#5C4033] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%238B6F5E%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
      >
        <option value="DATE_DESC">Date Added (Newest)</option>
        <option value="DATE_ASC">Date Added (Oldest)</option>
        <option value="TITLE_ASC">Title (A-Z)</option>
        <option value="TITLE_DESC">Title (Z-A)</option>
        <option value="PROGRESS_DESC">Progress (High-Low)</option>
      </select>

      {/* ปุ่มสลับมุมมอง (Grid / List) */}
      <div className="flex bg-white border border-[#D9D2C7] rounded-lg overflow-hidden ml-auto">
        <button 
          onClick={() => updateFilter('view', 'grid')}
          className={`p-2 transition-colors ${currentView === 'grid' ? 'text-[#5C4033] bg-[#EDE8DF]' : 'text-[#8B6F5E] hover:text-[#5C4033]'}`}
        >
          <Grid size={14} />
        </button>
        <button 
          onClick={() => updateFilter('view', 'list')}
          className={`p-2 transition-colors ${currentView === 'list' ? 'text-[#5C4033] bg-[#EDE8DF]' : 'text-[#8B6F5E] hover:text-[#5C4033]'}`}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  )
}