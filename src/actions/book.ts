"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface BookInput {
  title: string
  authors: string[]
  coverImage: string | null
  pageCount: number
}

export async function addBookToLibrary(bookData: BookInput) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.book.create({
      data: {
        userId: session.user.id,
        title: bookData.title,
        author: bookData.authors.join(", "),
        coverImage: bookData.coverImage,
        totalPages: bookData.pageCount,
        status: "WANT_TO_READ",
      },
    })
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, error: "Database error" }
  }
}