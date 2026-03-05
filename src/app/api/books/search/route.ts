import { NextResponse } from "next/server"

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    pageCount?: number;
    categories?: string[];
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ items: [] })
    }

    const isIsbn = /^[0-9]{10,13}$/.test(query.trim())
    const searchQuery = isIsbn ? `isbn:${query.trim()}` : query

    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchQuery)}&maxResults=8&printType=books&key=${apiKey}`)

    if (!res.ok) {
      return NextResponse.json({ items: [] }, { status: 500 })
    }

    const data = await res.json()

    const books = data.items?.map((item: GoogleBookItem) => ({
      id: item.id,
      title: item.volumeInfo?.title || "ไม่มีชื่อเรื่อง",
      authors: item.volumeInfo?.authors || ["Unknown Author"],
      description: item.volumeInfo?.description
        ? item.volumeInfo.description.substring(0, 120) + "..."
        : "ไม่มีคำอธิบาย",
      coverImage: item.volumeInfo?.imageLinks?.thumbnail?.replace("http:", "https:") || null,
      pageCount: item.volumeInfo?.pageCount || 0,
      categories: item.volumeInfo?.categories || [],
    })) || []

    return NextResponse.json({ items: books })

  } catch (error) {
    console.error("[API] Error:", error)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}
