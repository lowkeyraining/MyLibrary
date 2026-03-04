"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface BookInput {
  title: string
  authors: string[]
  coverImage: string | null
  pageCount: number
  description?: string
  categories?: string[]
  externalId?: string
}

export async function addBookToLibrary(bookData: BookInput) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    await prisma.book.create({
      data: {
        userId: session.user.id,
        title: bookData.title,
        author: bookData.authors.join(", "),
        coverImage: bookData.coverImage,
        totalPages: bookData.pageCount,
        description: bookData.description,
        externalId: bookData.externalId,
        status: "WANT_TO_READ",
        addedVia: "GOOGLE_BOOKS",
        categories: bookData.categories?.length
          ? { create: await resolveCategories(bookData.categories) }
          : undefined,
      },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: "Database error" }
  }
}

interface ManualBookInput {
  title: string
  authors: string[]
  isbn: string | null
  totalPages: number
  categories: string[]
  description?: string
  coverImage: string | null
}

export async function addBookManually(bookData: ManualBookInput) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    await prisma.book.create({
      data: {
        userId: session.user.id,
        title: bookData.title,
        author: bookData.authors.join(", "),
        coverImage: bookData.coverImage,
        totalPages: bookData.totalPages || null,
        isbn: bookData.isbn || null,
        description: bookData.description || null,
        status: "WANT_TO_READ",
        addedVia: "MANUAL",
        categories: bookData.categories.length
          ? { create: await resolveCategories(bookData.categories) }
          : undefined,
      },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: "Database error" }
  }
}

async function resolveCategories(names: string[]) {
  const results = []
  for (const name of names) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    })
    results.push({ categoryId: category.id })
  }
  return results
}

export async function toggleFavorite(bookId: string, currentStatus: boolean) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    await prisma.book.update({
      where: { id: bookId, userId: session.user.id },
      data: { isFavorite: !currentStatus },
    })
    revalidatePath("/books")
    revalidatePath("/favorites")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: "Database error" }
  }
}

export async function updateBookProgress(bookId: string, currentPage: number, note?: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId, userId: session.user.id }
    })
    if (!book) return { success: false, error: "Book not found" }

    // ── Auto status logic ──
    const total = book.totalPages || 0
    let newStatus = book.status

    if (currentPage >= total && total > 0) {
      newStatus = "COMPLETED"
    } // ลบ currentPage > 0 ออก
    else if (book.status === "WANT_TO_READ" || book.status === "DROPPED") {
      newStatus = "READING"
    }

    await prisma.$transaction([
      prisma.book.update({
        where: { id: bookId },
        data: {
          currentPage,
          status: newStatus,
          ...(newStatus === "COMPLETED" && !book.finishedAt ? { finishedAt: new Date() } : {}),
          ...(newStatus === "READING" && !book.startedAt ? { startedAt: new Date() } : {}),
        }
      }),
      prisma.progressLog.create({
        data: { bookId, currentPage, note: note || null }
      })
    ])
    revalidatePath(`/books/${bookId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}

export async function updateBookStatus(bookId: string, status: any) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    await prisma.book.update({
      where: { id: bookId, userId: session.user.id },
      data: { status }
    })
    revalidatePath(`/books/${bookId}`)
    revalidatePath(`/books`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}

export async function updateBookReview(bookId: string, rating: number, content: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    const existingReview = await prisma.review.findFirst({ where: { bookId } })
    if (existingReview) {
      await prisma.review.update({ where: { id: existingReview.id }, data: { rating, content } })
    } else {
      await prisma.review.create({ data: { bookId, rating, content } })
    }
    revalidatePath(`/books/${bookId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}

export async function deleteBooks(bookIds: string[]) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }
  try {
    await prisma.book.deleteMany({
      where: { id: { in: bookIds }, userId: session.user.id }
    })
    revalidatePath("/books")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}

// เพิ่มฟังก์ชันนี้ใน actions/book.ts

export async function updateBookDetails(bookId: string, data: {
  title: string
  authors: string[]
  isbn: string | null
  totalPages: number
  description: string | null
  coverImage: string | null
  categories: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  try {
    // ลบ categories เดิมออกก่อน แล้วสร้างใหม่
    await prisma.bookCategory.deleteMany({ where: { bookId } })

    const categoryData = await resolveCategories(data.categories)

    await prisma.book.update({
      where: { id: bookId, userId: session.user.id },
      data: {
        title: data.title,
        author: data.authors.join(", "),
        isbn: data.isbn,
        totalPages: data.totalPages,
        description: data.description,
        coverImage: data.coverImage,
        categories: { create: categoryData },
      }
    })

    revalidatePath(`/books/${bookId}`)
    revalidatePath("/books")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}