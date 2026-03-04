"use client"

import { createContext, useContext, useState } from "react"
import Link from "next/link"
import { BookOpen, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import { deleteBooks } from "@/actions/book"
import AddBookModal from "@/components/add-book-modal"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string | null
  status: string
  isFavorite: boolean
  currentPage: number | null
  totalPages: number | null
  review: { rating: number } | null
}

const SelectContext = createContext<{
  selectedIds: Set<string>
  toggleSelect: (id: string) => void
}>({ selectedIds: new Set(), toggleSelect: () => {} })

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'READING': return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#C07B5A]/15 text-[#C07B5A]">Reading</span>
    case 'COMPLETED': return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#9CAF88]/20 text-[#5A7A4A]">Completed</span>
    case 'DROPPED': return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#C4887A]/15 text-[#9A5A4A]">On Hold</span>
    default: return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#A89CC8]/15 text-[#7B6FA8]">Want to read</span>
  }
}

export function SelectProvider({ children, books, totalBooks, completedBooks }: {
  children: React.ReactNode
  books: Book[]
  totalBooks: number
  completedBooks: number
}) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  const isAllSelected = books.length > 0 && selectedIds.size === books.length
  const isPartial = selectedIds.size > 0 && selectedIds.size < books.length

  const toggleSelectAll = () => setSelectedIds(isAllSelected ? new Set() : new Set(books.map(b => b.id)))

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    const confirmed = confirm(`แน่ใจใช่มั้ยว่าจะลบหนังสือ ${selectedIds.size} เล่มที่เลือก?\nการลบจะไม่สามารถกู้คืนได้`)
    if (!confirmed) return
    setIsDeleting(true)
    const result = await deleteBooks(Array.from(selectedIds))
    if (result.success) { setSelectedIds(new Set()); router.refresh() }
    else alert("เกิดข้อผิดพลาดในการลบหนังสือ")
    setIsDeleting(false)
  }

  return (
    <SelectContext.Provider value={{ selectedIds, toggleSelect }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#5C4033] mb-1">My Library</h1>
          <p className="text-[13px] text-[#8B6F5E]">
            {selectedIds.size > 0
              ? `เลือกแล้ว ${selectedIds.size} เล่ม`
              : `${totalBooks} เล่มทั้งหมด · อ่านจบแล้ว ${completedBooks} เล่ม`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleSelectAll} title={isAllSelected ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
            className={`w-8 h-8 border-2 rounded-md flex items-center justify-center transition-colors flex-shrink-0
              ${isAllSelected ? "bg-[#C07B5A] border-[#C07B5A]" : isPartial ? "bg-white border-[#C07B5A]" : "bg-white border-[#D9D2C7] hover:border-[#C07B5A]"}`}>
            {isAllSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            {isPartial && <div className="w-3.5 h-0.5 bg-[#C07B5A] rounded-full" />}
          </button>
          <button onClick={handleDelete} disabled={selectedIds.size === 0 || isDeleting}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-colors
              ${selectedIds.size > 0 ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "bg-white border-[#D9D2C7] text-[#C4B5A8] cursor-not-allowed"}`}>
            <Trash2 size={13} />
            {isDeleting ? "กำลังลบ..." : selectedIds.size > 0 ? `ลบที่เลือก (${selectedIds.size})` : "ลบที่เลือก"}
          </button>
          <AddBookModal />
        </div>
      </div>
      {children}
    </SelectContext.Provider>
  )
}

export function BooksGrid({ books, view }: { books: Book[], view: string }) {
  const { selectedIds, toggleSelect } = useContext(SelectContext)
  const isSelectMode = selectedIds.size > 0

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
        {books.map((book, index) => (
          <ListCard key={book.id} book={book} index={index}
            isSelectMode={isSelectMode} isSelected={selectedIds.has(book.id)}
            onToggleSelect={() => toggleSelect(book.id)} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {books.map((book, index) => (
        <GridCard key={book.id} book={book} index={index}
          isSelectMode={isSelectMode} isSelected={selectedIds.has(book.id)}
          onToggleSelect={() => toggleSelect(book.id)} />
      ))}
    </div>
  )
}

function GridCard({ book, index, isSelectMode, isSelected, onToggleSelect }: {
  book: Book; index: number; isSelectMode: boolean; isSelected: boolean; onToggleSelect: () => void
}) {
  const pct = book.totalPages && book.totalPages > 0
    ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100)) : 0

  return (
    <div
      className={`bg-white border rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200 relative group flex flex-col animate-in fade-in slide-in-from-bottom-4 select-none
        ${isSelected ? "border-[#C07B5A] shadow-[0_0_0_2px_rgba(192,123,90,0.2)]" : "border-[#D9D2C7] hover:border-[#C4A882] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(92,64,51,0.08)]"}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Checkbox — แสดงตลอดเวลา */}
      <div
        onClick={e => { e.stopPropagation(); onToggleSelect() }}
        className={`absolute top-2 left-2 z-20 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected ? "bg-[#C07B5A] border-[#C07B5A]" : "bg-white/80 border-[#D9D2C7] opacity-0 group-hover:opacity-100"}`}
      >
        {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>

      <Link href={`/books/${book.id}`}
        onClick={e => { if (isSelectMode) { e.preventDefault(); onToggleSelect() } }}
        className="flex flex-col flex-1"
      >
        <div className="w-full h-[160px] relative bg-[#EDE8DF] flex flex-col items-center justify-center p-4">
          {!isSelectMode && (
            <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="scale-90 origin-top-right">
                <FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} />
              </div>
            </div>
          )}
          {book.coverImage
            ? <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full absolute inset-0" />
            : <><BookOpen size={20} className="text-[#C4A882] mb-1.5" /><div className="text-[10px] font-semibold text-[#8B6F5E] text-center leading-[1.3] line-clamp-3">{book.title}</div></>
          }
        </div>
        <div className="p-2.5 pb-3 flex-1 flex flex-col">
          <div className="text-[12px] font-semibold leading-[1.35] mb-0.5 line-clamp-2 text-[#5C4033]">{book.title}</div>
          <div className="text-[10px] text-[#8B6F5E] mb-2 truncate">{book.author}</div>
          <div className="mt-auto flex items-center justify-between gap-1.5">
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-[3px] bg-[#EDE8DF] rounded-full overflow-hidden">
                <div className="h-full bg-[#C07B5A] rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[9px] text-[#8B6F5E]">{pct}%</div>
            </div>
            <StatusBadge status={book.status} />
          </div>
        </div>
      </Link>
    </div>
  )
}

function ListCard({ book, index, isSelectMode, isSelected, onToggleSelect }: {
  book: Book; index: number; isSelectMode: boolean; isSelected: boolean; onToggleSelect: () => void
}) {
  const pct = book.totalPages && book.totalPages > 0
    ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100)) : 0

  return (
    <div
      className={`flex items-center gap-3.5 bg-white border rounded-[10px] p-3 transition-colors relative group select-none
        ${isSelected ? "border-[#C07B5A] shadow-[0_0_0_2px_rgba(192,123,90,0.2)]" : "border-[#D9D2C7] hover:border-[#C4A882]"}`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Checkbox — แสดงตลอดเวลา */}
      <div
        onClick={onToggleSelect}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all
          ${isSelected ? "bg-[#C07B5A] border-[#C07B5A]" : "bg-white border-[#D9D2C7] opacity-0 group-hover:opacity-100"}`}
      >
        {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>

      <Link href={`/books/${book.id}`}
        onClick={e => { if (isSelectMode) { e.preventDefault(); onToggleSelect() } }}
        className="flex items-center gap-3.5 flex-1 min-w-0"
      >
        <div className="w-[38px] h-[54px] rounded bg-[#EDE8DF] flex-shrink-0 relative overflow-hidden">
          {book.coverImage
            ? <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full absolute inset-0" />
            : <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-[#C4A882]" /></div>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-[13px] font-semibold text-[#5C4033] truncate leading-tight mb-0.5">{book.title}</div>
          <div className="text-[11px] text-[#8B6F5E] truncate mb-1.5">{book.author}</div>
          <StatusBadge status={book.status} />
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2.5 min-w-[120px]">
            <div className="flex-1 h-[3px] bg-[#EDE8DF] rounded-full overflow-hidden">
              <div className="h-full bg-[#C07B5A] rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] font-medium text-[#8B6F5E] min-w-[32px] text-right">{pct}%</span>
          </div>
          <div className="text-[12px] text-[#C07B5A] min-w-[40px] text-right font-semibold">★ {book.review?.rating || "—"}</div>
          {!isSelectMode && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1">
              <div className="scale-[0.85]"><FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} /></div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}