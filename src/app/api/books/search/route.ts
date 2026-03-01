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

    console.log(`[API] กำลังค้นหาหนังสือคำว่า: ${query}`)

    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=8&printType=books`)
    
    // เช็คว่า Google API ตอบกลับมาปกติไหม (สถานะ 200)
    if (!res.ok) {
      console.error(`[API] Google Books Error: ${res.status} ${res.statusText}`)
      return NextResponse.json({ items: [] }, { status: 500 })
    }

    const data = await res.json()
    console.log(`[API] Google ตอบกลับมา: เจอหนังสือ ${data.items ? data.items.length : 0} เล่ม`)

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
    // ถ้าโค้ดพัง จะมาตกตรงนี้ และแสดง Error ใน Terminal
    console.error("[API] พังจ้า! เกิด Error ขึ้น:", error)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}