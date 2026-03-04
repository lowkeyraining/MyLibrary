import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorite-button"
import { ChevronRight, Star } from "lucide-react"
import { StatusSelect } from "@/components/status-select"
import { UpdateProgressModal } from "@/components/update-progress-modal"
import { ReviewModal } from "@/components/review-modal"
import { EditBookModal } from "@/components/edit-book-modal"
import { DeleteBookButton } from "@/components/delete-book-button"

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(date)
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const book = await prisma.book.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: {
      categories: { include: { category: true } },
      progressLogs: { orderBy: { loggedAt: 'desc' } },
      review: true
    }
  })

  if (!book) return notFound()

  const total = book.totalPages || 0
  const current = book.currentPage || 0
  const progressPct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  const initial = book.title.charAt(0).toUpperCase()

  return (
    <div className="max-w-[1000px] w-full mx-auto p-6 md:p-10">

      {/* Breadcrumb */}
      <div className="text-xs text-[#8B6F5E] mb-6 flex items-center gap-1.5">
        <Link href="/books" className="hover:text-[#C07B5A] transition-colors">My Library</Link>
        <ChevronRight size={12} />
        <span className="text-[#5C4033] font-medium line-clamp-1">{book.title}</span>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-7 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* COL 1: Cover + Status only */}
        <div className="flex flex-col gap-3">
          <div className="w-full aspect-[2/3] rounded-xl border border-[#D9D2C7] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#C07B5A] to-[#8B4A2E] group shadow-sm">
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton bookId={book.id} initialFavorite={book.isFavorite} />
            </div>
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="text-[28px] font-bold text-white/75 tracking-wider">{initial}</div>
                <div className="text-[10px] font-semibold text-white/50 text-center px-3 leading-tight mt-2">{book.title}</div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E]">Status</div>
            <StatusSelect bookId={book.id} currentStatus={book.status} />
          </div>
        </div>

        {/* COL 2: Info + Synopsis + Progress */}
        <div className="flex flex-col gap-5">
          <div>
            {/* Categories + Edit/Delete buttons in same row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-medium bg-[#C07B5A]/10 text-[#C07B5A]">
                  {book.status.replace(/_/g, ' ')}
                </span>
                {book.categories.map(c => (
                  <span key={c.categoryId} className="inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-medium bg-[#EDE8DF] text-[#8B6F5E] border border-[#D9D2C7]">
                    {c.category.name}
                  </span>
                ))}
              </div>

              {/* Edit + Delete icons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <EditBookModal book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  isbn: book.isbn,
                  totalPages: book.totalPages,
                  description: book.description,
                  coverImage: book.coverImage,
                  categories: book.categories,
                }} />
                <DeleteBookButton bookId={book.id} />
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#5C4033] leading-snug mb-1">
              {book.title}
            </h1>
            <p className="text-[15px] text-[#8B6F5E]">{book.author}</p>
          </div>

          {book.description && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E] mb-2.5">Synopsis</div>
              <p className="text-[14px] text-[#8B6F5E] leading-[1.8]">{book.description}</p>
            </div>
          )}

          {/* Progress Card */}
          <div className="bg-white border border-[#D9D2C7] rounded-xl p-[18px] shadow-sm mt-2">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E] mb-3">Progress</div>
            <div className="h-[7px] bg-[#EDE8DF] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#C07B5A] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex justify-between text-[12px] text-[#8B6F5E] mb-3.5">
              <span>หน้า {current} {total > 0 ? `/ ${total}` : ''}</span>
              <span>{progressPct}%</span>
            </div>
            <UpdateProgressModal
              bookId={book.id}
              title={book.title}
              author={book.author}
              totalPages={book.totalPages || 0}
              initialPage={book.currentPage || 0}
            />
          </div>
        </div>

        {/* COL 3: Rating & Review */}
        <div>
          <div className="bg-white border border-[#D9D2C7] rounded-xl p-[18px] shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E] mb-3">Rating & Review</div>
            {book.review ? (
              <>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < book.review!.rating ? "text-[#C07B5A] fill-[#C07B5A]" : "text-[#D9D2C7]"} />
                    ))}
                  </div>
                  <span className="text-[13px] font-semibold text-[#5C4033]">{book.review.rating} ดาว</span>
                </div>
                <p className="text-[13px] text-[#8B6F5E] leading-[1.7] mb-3.5">{book.review.content}</p>
              </>
            ) : (
              <p className="text-[12px] text-[#8B6F5E] italic mb-3.5">ยังไม่ได้เขียนรีวิว</p>
            )}
            <ReviewModal
              bookId={book.id}
              title={book.title}
              author={book.author}
              initialRating={book.review?.rating || 0}
              initialContent={book.review?.content || ""}
            />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-7 border-t border-[#D9D2C7] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E] mb-3">Book Info</div>
          <div className="flex flex-col gap-2.5 text-[13px]">
            {book.isbn && <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">ISBN</span><span className="text-[#5C4033]">{book.isbn}</span></div>}
            {book.publisher && <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">Publisher</span><span className="text-[#5C4033]">{book.publisher}</span></div>}
            {book.publishedDate && <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">Published</span><span className="text-[#5C4033]">{book.publishedDate}</span></div>}
            <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">Pages</span><span className="text-[#5C4033]">{book.totalPages || '-'}</span></div>
            <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">Added via</span><span className="text-[#5C4033]">{book.addedVia.replace('_', ' ')}</span></div>
            <div className="flex gap-3"><span className="text-[#8B6F5E] min-w-[82px]">Added on</span><span className="text-[#5C4033]">{formatDate(book.createdAt)}</span></div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8B6F5E] mb-3">Progress History</div>
          {book.progressLogs.length > 0 ? (
            <div className="flex flex-col">
              {book.progressLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-[#D9D2C7] last:border-0">
                  <div className="text-[13px] font-semibold text-[#5C4033] min-w-[55px]">p. {log.currentPage}</div>
                  <div className="text-[12px] text-[#8B6F5E] flex-1 mt-0.5">{log.note || '-'}</div>
                  <div className="text-[11px] text-[#8B6F5E] whitespace-nowrap mt-0.5">{formatDate(log.loggedAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[#8B6F5E] italic">ยังไม่มีประวัติการอ่าน</p>
          )}
        </div>
      </div>
    </div>
  )
}