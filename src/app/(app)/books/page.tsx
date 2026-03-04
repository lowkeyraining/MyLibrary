import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"
import { LibraryFilters } from "@/components/library-filters"
import { SelectProvider, BooksGrid } from "@/components/books-grid"

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; query?: string; category?: string; sort?: string; view?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { status = "ALL", query = "", category = "ALL", sort = "DATE_DESC", view = "grid" } = await searchParams

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

  const totalBooks = allBooks.length
  const completedBooks = allBooks.filter(b => b.status === 'COMPLETED').length
  const readingBooks = allBooks.filter(b => b.status === 'READING').length
  const wantBooks = allBooks.filter(b => b.status === 'WANT_TO_READ').length
  const droppedBooks = allBooks.filter(b => b.status === 'DROPPED').length

  let displayedBooks = [...allBooks]
  if (status !== "ALL") displayedBooks = displayedBooks.filter(b => b.status === status)
  if (query) {
    const q = query.toLowerCase()
    displayedBooks = displayedBooks.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
  }
  if (category !== "ALL") displayedBooks = displayedBooks.filter(b => b.categories.some(c => c.category.name === category))

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

  return (
    <div className="max-w-[1200px] w-full mx-auto p-6 md:p-10">
      <SelectProvider
        books={displayedBooks}
        totalBooks={totalBooks}
        completedBooks={completedBooks}
      >
        {/* Filter + Tabs + Grid อยู่ใน children ลำดับถูกต้อง */}
        <LibraryFilters categories={uniqueCategories} />

        {/* ── TABS ── */}
        <div className="flex border-b border-[#D9D2C7] mb-6 mt-4 overflow-x-auto hide-scrollbar">
          {[
            { label: "All", value: "ALL", count: totalBooks },
            { label: "Reading", value: "READING", count: readingBooks },
            { label: "Want to Read", value: "WANT_TO_READ", count: wantBooks },
            { label: "Completed", value: "COMPLETED", count: completedBooks },
            { label: "On Hold", value: "DROPPED", count: droppedBooks },
          ].map(tab => (
            <Link key={tab.value} href={buildTabUrl(tab.value)}
              className={`py-2.5 px-4 text-[13px] whitespace-nowrap transition-colors ${status === tab.value ? 'font-semibold text-[#5C4033] border-b-2 border-[#C07B5A]' : 'text-[#8B6F5E] hover:text-[#5C4033] border-b-2 border-transparent'}`}>
              {tab.label} <span className="text-[10px] bg-[#EDE8DF] py-[1px] px-[6px] rounded-full ml-1 font-normal text-[#5C4033]">{tab.count}</span>
            </Link>
          ))}
        </div>

        {/* ── Books ── */}
        {displayedBooks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#D9D2C7] rounded-xl flex flex-col items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#D9D2C7] mb-3" />
            <p className="text-[#8B6F5E] text-[14px]">ไม่พบหนังสือ</p>
          </div>
        ) : (
          <BooksGrid books={displayedBooks} view={view} />
        )}
      </SelectProvider>
    </div>
  )
}