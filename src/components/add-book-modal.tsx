"use client"

import { addBookToLibrary } from "@/actions/book"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Book, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookResult {
  id: string
  title: string
  authors: string[]
  pageCount: number
  coverImage: string | null
  categories: string[]
}

export default function AddBookModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/api/books/search?q=${query}`)
      const data = await res.json()
      setResults(data.items)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (book: BookResult) => {
    setIsAdding(book.id)
    try {
      const result = await addBookToLibrary(book)
      if (result.success) {
        router.refresh()
        setIsOpen(false) 
        setResults([])
        setQuery("")
      } else {
        alert("Error adding book")
      }
    } catch { 
      alert("Something went wrong")
    } finally {
      setIsAdding(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5C4033] hover:bg-[#4A332A] text-white gap-2">
          <Plus size={18} /> Add Book
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[850px] bg-[#FAF9F6] border-[#D9D2C7] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#5C4033]">Add New Book</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#EDE8DF]">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="ชื่อหนังสือ, ผู้แต่ง หรือ ISBN..." 
                className="bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading} className="bg-[#5C4033] text-white">
                {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
              </Button>
            </div>

            <div className="space-y-3">
              {results.map((book) => (
                <div key={book.id} className="flex gap-4 p-3 bg-white border border-[#D9D2C7] rounded-lg hover:border-[#C07B5A] transition-all">
                  <div className="w-[60px] h-[90px] bg-gray-200 flex-shrink-0 rounded overflow-hidden shadow-sm">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Book /></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#5C4033] truncate text-sm">{book.title}</h4>
                    <p className="text-xs text-[#8B6F5E] mb-1">{book.authors.join(", ")}</p>
                    <p className="text-[10px] text-gray-400">{book.pageCount} pages</p>
                  </div>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleAddBook(book)}
                    disabled={isAdding === book.id}
                    className="self-center text-[#C07B5A] border-[#C07B5A] hover:bg-[#C07B5A] hover:text-white min-w-[80px]"
                  >
                    {isAdding === book.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              ))}
              
              {!loading && results.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  พิมพ์ชื่อหนังสือเพื่อค้นหา
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <div className="py-10 text-center text-gray-400 text-sm italic">Manual Entry: Coming Soon</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}