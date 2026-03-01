import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import { BookOpen, HeartOff } from "lucide-react"

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // ดึงเฉพาะหนังสือที่เป็น Favorite
  const favBooks = await prisma.book.findMany({
    where: { 
      userId: session.user.id,
      isFavorite: true
    },
    include: { review: true },
    orderBy: { createdAt: 'desc' }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READING':
        return <span className="inline-flex items-center text-[10px] px-[9px] py-[3px] rounded-full font-medium bg-[#C07B5A]/12 text-[#C07B5A]">Reading</span>
      case 'COMPLETED':
        return <span className="inline-flex items-center text-[10px] px-[9px] py-[3px] rounded-full font-medium bg-[#9CAF88]/18 text-[#5A7A4A]">Completed</span>
      case 'DROPPED':
        return <span className="inline-flex items-center text-[10px] px-[9px] py-[3px] rounded-full font-medium bg-[#C4887A]/15 text-[#9A5A4A]">Dropped</span>
      case 'WANT_TO_READ':
      default:
        return <span className="inline-flex items-center text-[10px] px-[9px] py-[3px] rounded-full font-medium bg-[#A89CC8]/15 text-[#7B6FA8]">Want to read</span>
    }
  }

  return (
    <div className="max-w-[1200px] w-full mx-auto p-6 md:p-10">
      
      {/* ── HEADER ── */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold tracking-tight text-[#5C4033] mb-1">Favorites</h1>
        <p className="text-[13px] text-[#8B6F5E]">หนังสือที่ชื่นชอบ · {favBooks.length} เล่ม</p>
      </div>

      {/* ── GRID ── */}
      {favBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <HeartOff className="w-12 h-12 text-[#D9D2C7] mb-4" />
          <p className="text-[16px] font-semibold text-[#5C4033] mb-1.5">ยังไม่มีหนังสือเล่มโปรด</p>
          <p className="text-[13px] text-[#8B6F5E]">กดปุ่มหัวใจที่หนังสือเพื่อเพิ่มลงในรายการโปรดของคุณ</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favBooks.map((book, index) => {
            const pct = book.totalPages && book.totalPages > 0 
              ? Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100)) 
              : 0;

            return (
              <Link 
                href={`/books/${book.id}`} 
                key={book.id}
                className="bg-white border border-[#D9D2C7] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#C4A882] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(92,64,51,0.1)] relative group flex flex-col animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Cover Area */}
                <div className="w-full aspect-[2/3] relative bg-gradient-to-br from-[#C07B5A] to-[#8B4A2E] flex flex-col items-center justify-center p-4">
                  
                  {/* ปุ่ม Favorite (ใช้ CSS เพื่อหลีกเลี่ยง onClick error) */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="scale-90 origin-top-right bg-white/90 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
                      <FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} />
                    </div>
                  </div>

                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full absolute inset-0" />
                  ) : (
                    <>
                      <div className="text-[22px] font-bold text-white/70 tracking-wider mb-2">
                        {book.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-[9px] font-semibold text-white/50 text-center leading-[1.3] px-1 line-clamp-3">
                        {book.title}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Info Area */}
                <div className="p-3 flex-1 flex flex-col">
                  <div className="text-[13px] font-semibold leading-[1.35] mb-[3px] line-clamp-2 text-[#5C4033]" title={book.title}>
                    {book.title}
                  </div>
                  <div className="text-[11px] text-[#8B6F5E] mb-2.5 truncate" title={book.author}>
                    {book.author}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="h-[3px] bg-[#EDE8DF] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#C07B5A] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8B6F5E]">
                        {book.status === 'COMPLETED' && book.review?.rating ? `★ ${book.review.rating}` : `${pct}%`}
                      </span>
                      {getStatusBadge(book.status)}
                    </div>
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