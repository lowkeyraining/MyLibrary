// app/api/books/search/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ items: [] })
  }

  // เรียก Google Books API
  const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
  const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5&printType=books`)
  const data = await res.json()

  // จัดรูปแบบข้อมูลให้ใช้ง่ายๆ
  const books = data.items?.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ["Unknown Author"],
    description: item.volumeInfo.description?.substring(0, 150) + "...",
    coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || null,
    pageCount: item.volumeInfo.pageCount || 0,
    categories: item.volumeInfo.categories || [],
  })) || []

  return NextResponse.json({ items: books })
}