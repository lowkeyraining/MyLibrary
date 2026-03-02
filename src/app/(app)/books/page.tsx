import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AddBookModal from "@/components/add-book-modal"
import { FavoriteButton } from "@/components/favorite-button"
import { BookOpen } from "lucide-react"
import { LibraryFilters } from "@/components/library-filters"

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; query?: string; category?: string; sort?: string; view?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // ดึงค่าตัวกรองและ view จาก URL
  const { status = "ALL", query = "", category = "ALL", sort = "DATE_DESC", view = "grid" } = await searchParams

  // 1. ดึงหนังสือทั้งหมดของ User
  const allBooks = await prisma.book.findMany({
    where: { userId: session.user.id },
    include: { 
      categories: { include: { category: true } },
      review: true 
    },
  })

  const uniqueCategories = Array.from(
    new Set(allBooks.flatMap((b) => b.categories.map((c) => c.category.name)))
  ).sort()

  // คำนวณสถิติแต่ละสถานะ
  const totalBooks = allBooks.length
  const completedBooks = allBooks.filter(b => b.status === 'COMPLETED').length
  const readingBooks = allBooks.filter(b => b.status === 'READING').length
  const wantBooks = allBooks.filter(b => b.status === 'WANT_TO_READ').length
  const droppedBooks = allBooks.filter(b => b.status === 'DROPPED').length // นับจำนวนเล่มที่ On Hold (Dropped)

  // 2. กรองข้อมูล
  let displayedBooks = [...allBooks]

  if (status !== "ALL") displayedBooks = displayedBooks.filter(b => b.status === status)
  
  if (query) {
    const q = query.toLowerCase()
    displayedBooks = displayedBooks.filter(
      b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    )
  }

  if (category !== "ALL") {
    displayedBooks = displayedBooks.filter(b => b.categories.some(c => c.category.name === category))
  }

  // 3. จัดเรียงข้อมูล
  displayedBooks.sort((a, b) => {
    if (sort === 'TITLE_ASC') return a.title.localeCompare(b.title)
    if (sort === 'TITLE_DESC') return b.title.localeCompare(a.title)
    if (sort === 'PROGRESS_DESC') {
      const pctA = a.totalPages ? (a.currentPage || 0) / a.totalPages : 0
      const pctB = b.totalPages ? (b.currentPage || 0) / b.totalPages : 0
      return pctB - pctA
    }
    if (sort === 'DATE_ASC') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // สร้าง URL สำหรับกดเปลี่ยนแท็บ โดยจำค่า view ไว้ด้วย
  const buildTabUrl = (targetStatus: string) => {
    const params = new URLSearchParams()
    if (targetStatus !== "ALL") params.set("status", targetStatus)
    if (query) params.set("query", query)
    if (category !== "ALL") params.set("category", category)
    if (sort !== "DATE_DESC") params.set("sort", sort)
    if (view !== "grid") params.set("view", view)
    
    const queryStr = params.toString()
    return `/books${queryStr ? `?${queryStr}` : ''}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READING':
        return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#C07B5A]/15 text-[#C07B5A]">Reading</span>
      case 'COMPLETED':
        return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#9CAF88]/20 text-[#5A7A4A]">Completed</span>
      case 'DROPPED':
        return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#C4887A]/15 text-[#9A5A4A]">On Hold</span>
      case 'WANT_TO_READ':
      default:
        return <span className="inline-flex items-center text-[9px] px-[7px] py-[2px] rounded-full font-medium bg-[#A89CC8]/15 text-[#7B6FA8]">Want to read</span>
    }
  }

  return (
    <div className="max-w-[1200px] w-full mx-auto p-6 md:p-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#5C4033] mb-1">My Library</h1>
          <p className="text-[13px] text-[#8B6F5E]">{totalBooks} เล่มทั้งหมด · อ่านจบแล้ว {completedBooks} เล่ม</p>
        </div>
        <AddBookModal />
      </div>

      <LibraryFilters categories={uniqueCategories} />

      {/* ── TABS ── */}
      <div className="flex border-b border-[#D9D2C7] mb-6 mt-4 overflow-x-auto hide-scrollbar">
        <Link href={buildTabUrl('ALL')} className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === 'ALL' ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
          All <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{totalBooks}</span>
        </Link>
        <Link href={buildTabUrl('READING')} className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === 'READING' ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
          Reading <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{readingBooks}</span>
        </Link>
        <Link href={buildTabUrl('WANT_TO_READ')} className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === 'WANT_TO_READ' ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
          Want to Read <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{wantBooks}</span>
        </Link>
        <Link href={buildTabUrl('COMPLETED')} className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === 'COMPLETED' ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
          Completed <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{completedBooks}</span>
        </Link>
        
        {/* เพิ่มแท็บ On Hold ตรงนี้ */}
        <Link href={buildTabUrl('DROPPED')} className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === 'DROPPED' ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
          On Hold <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{droppedBooks}</span>
        </Link>
      </div>

      {/* ── BOOK GRID / LIST ── */}
      {displayedBooks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#D9D2C7] rounded-xl flex flex-col items-center justify-center">
          <BookOpen className="w-10 h-10 text-[#D9D2C7] mb-3" />
          <p className="text-[#8B6F5E] text-[14px]">ไม่พบหนังสือ</p>
        </div>
      ) : view === 'list' ? (
        
        /* ── LIST VIEW ── */
        <div className="flex flex-col gap-2.5">
          {displayedBooks.map((book, index) => {
            const pct = book.totalPages && book.totalPages > 0 
              ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100)) : 0;
            return (
              <Link 
                href={`/books/${book.id}`} 
                key={book.id}
                className="flex items-center gap-3.5 bg-white border border-[#D9D2C7] rounded-[10px] p-3 cursor-pointer transition-colors hover:border-[#C4A882] relative group animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="w-[38px] h-[54px] rounded bg-[#EDE8DF] flex-shrink-0 flex flex-col items-center justify-center relative overflow-hidden">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full absolute inset-0" />
                  ) : (
                    <BookOpen size={14} className="text-[#C4A882]" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="text-[13px] font-semibold text-[#5C4033] truncate leading-tight mb-0.5">{book.title}</div>
                  <div className="text-[11px] text-[#8B6F5E] truncate mb-1.5">{book.author}</div>
                  <div className="flex items-center">{getStatusBadge(book.status)}</div>
                </div>
                
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2.5 min-w-[120px]">
                    <div className="flex-1 h-[3px] bg-[#EDE8DF] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C07B5A] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-medium text-[#8B6F5E] min-w-[32px] text-right">{pct}%</span>
                  </div>
                  
                  <div className="text-[12px] text-[#C07B5A] min-w-[40px] text-right font-semibold">
                    ★ {book.review?.rating || "—"}
                  </div>
                  
                  <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center pr-1">
                    <div className="scale-[0.85]">
                      <FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      ) : (

        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedBooks.map((book, index) => {
            const pct = book.totalPages && book.totalPages > 0 
              ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100)) : 0;
            return (
              <Link 
                href={`/books/${book.id}`} 
                key={book.id}
                className="bg-white border border-[#D9D2C7] rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#C4A882] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(92,64,51,0.08)] relative group flex flex-col animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-full h-[160px] relative bg-[#EDE8DF] flex flex-col items-center justify-center p-4">
                  <div className="absolute top-1.5 right-1.5 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <div className="scale-90 origin-top-right">
                      <FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} />
                    </div>
                  </div>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full absolute inset-0" />
                  ) : (
                    <>
                      <BookOpen size={20} className="text-[#C4A882] mb-1.5" />
                      <div className="text-[10px] font-semibold text-[#8B6F5E] text-center leading-[1.3] line-clamp-3">{book.title}</div>
                    </>
                  )}
                </div>
                
                <div className="p-2.5 pb-3 flex-1 flex flex-col">
                  <div className="text-[12px] font-semibold leading-[1.35] mb-0.5 line-clamp-2 text-[#5C4033]" title={book.title}>{book.title}</div>
                  <div className="text-[10px] text-[#8B6F5E] mb-2 truncate" title={book.author}>{book.author}</div>
                  
                  <div className="mt-auto flex items-center justify-between gap-1.5">
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-[3px] bg-[#EDE8DF] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C07B5A] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[9px] text-[#8B6F5E]">{pct}%</div>
                    </div>
                    {getStatusBadge(book.status)}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}