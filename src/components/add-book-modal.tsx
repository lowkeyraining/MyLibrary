"use client"

import { addBookToLibrary, addBookManually } from "@/actions/book"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Search, Book, Plus, Loader2, Upload, X, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookResult {
  id: string
  title: string
  authors: string[]
  pageCount: number
  coverImage: string | null
  categories: string[]
  description?: string
}

const PRESET_CATEGORIES = [
  "Business", "Self-help", "Fantasy", "Science", "Biography",
  "Mystery", "Romance", "History", "Technology", "Fiction",
  "Non-fiction", "Psychology", "Philosophy", "Art", "Travel",
  "Cooking", "Health", "Sports", "Politics", "Education",
]

interface ManualFormData {
  title: string
  authors: string
  isbn: string
  totalPages: string
  categories: string[]
  description: string
  coverImage: string | null
  coverUrl: string
}

export default function AddBookModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Search tab state
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Manual tab state
  const [form, setForm] = useState<ManualFormData>({
    title: "", authors: "", isbn: "", totalPages: "",
    categories: [], description: "", coverImage: null, coverUrl: "",
  })
  const [categorySearch, setCategorySearch] = useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.items)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, 1000)
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  }, [query])

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

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, coverImage: reader.result as string, coverUrl: "" }))
    reader.readAsDataURL(file)
  }

  const handleCoverUrl = () => {
    if (form.coverUrl.trim()) {
      setForm(f => ({ ...f, coverImage: f.coverUrl, coverUrl: "" }))
    }
  }

  const toggleCategory = (cat: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }))
  }

  const addCustomCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && categorySearch.trim()) {
      const newCat = categorySearch.trim()
      if (!form.categories.includes(newCat)) {
        setForm(f => ({ ...f, categories: [...f.categories, newCat] }))
      }
      setCategorySearch("")
    }
  }

  const filteredCategories = PRESET_CATEGORIES.filter(c =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const handleSaveManual = async () => {
    if (!form.title.trim() || !form.authors.trim()) {
      alert("กรุณากรอก Title และ Author(s)")
      return
    }
    setIsSaving(true)
    try {
      const result = await addBookManually({
        title: form.title.trim(),
        authors: form.authors.split(",").map(a => a.trim()).filter(Boolean),
        isbn: form.isbn.trim() || null,
        totalPages: form.totalPages ? parseInt(form.totalPages) : 0,
        categories: form.categories,
        description: form.description.trim() || undefined,
        coverImage: form.coverImage,
      })
      if (result.success) {
        router.refresh()
        setIsOpen(false)
        setForm({ title: "", authors: "", isbn: "", totalPages: "", categories: [], description: "", coverImage: null, coverUrl: "" })
      } else {
        alert("Error saving book")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5C4033] hover:bg-[#4A332A] text-white gap-2">
          <Plus size={18} /> Add Book
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[520px] max-w-[95vw] bg-[#FAF9F6] border-[#D9D2C7] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#5C4033]">Add New Book</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 bg-[#EDE8DF] flex-shrink-0">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          {/* ─── SEARCH TAB ─── */}
          <TabsContent value="search" className="flex flex-col flex-1 min-h-0 mt-4 gap-3">
            <div className="flex gap-2 flex-shrink-0 relative">
              <Input
                placeholder="ชื่อหนังสือ, ผู้แต่ง หรือ ISBN..."
                className="bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F5E]">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {results.map((book) => (
                <div key={book.id} className="flex gap-3 p-3 bg-white border border-[#D9D2C7] rounded-lg hover:border-[#C07B5A] transition-all">
                  <div className="w-[50px] h-[75px] bg-gray-100 flex-shrink-0 rounded overflow-hidden shadow-sm">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Book size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-[75px]">
                    <div>
                      <h4 className="font-bold text-[#5C4033] text-sm leading-tight line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-[#8B6F5E] mt-0.5 truncate">{book.authors.join(", ")}</p>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-snug">{book.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddBook(book)}
                    disabled={isAdding === book.id}
                    className="self-center bg-[#5C4033] hover:bg-[#4A332A] text-white min-w-[64px] flex-shrink-0"
                  >
                    {isAdding === book.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                  </Button>
                </div>
              ))}
              {!loading && results.length === 0 && query.trim() === "" && (
                <div className="text-center py-10 text-gray-400 text-sm">พิมพ์ชื่อหนังสือเพื่อค้นหา</div>
              )}
              {!loading && results.length === 0 && query.trim() !== "" && (
                <div className="text-center py-10 text-gray-400 text-sm">ไม่พบหนังสือที่ค้นหา</div>
              )}
            </div>
          </TabsContent>

          {/* ─── MANUAL TAB ─── */}
          <TabsContent value="manual" className="flex flex-col flex-1 min-h-0 mt-4">
            <div className="overflow-y-auto flex-1 pr-1 space-y-5">

              {/* Cover + Fields row */}
              <div className="flex gap-4">
                {/* Cover upload */}
                <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: 130 }}>
                  <p className="text-sm font-semibold text-[#5C4033]">Book Cover</p>
                  <p className="text-xs text-[#8B6F5E] -mt-1">อัพโหลดหรือวางลิงก์รูปหน้าปก</p>

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[2/3] border-2 border-dashed border-[#D9D2C7] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#C07B5A] transition-colors bg-white overflow-hidden"
                  >
                    {form.coverImage ? (
                      <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={22} className="text-[#C4B5A8] mb-1" />
                        <span className="text-[11px] text-[#C4B5A8] text-center leading-tight">อัพโหลดรูปภาพ</span>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />

                  {/* URL input */}
                  <div className="flex gap-1">
                    <Input
                      placeholder="วางลิงก์รูปหน้าปก..."
                      className="bg-white text-xs h-8 flex-1 min-w-0"
                      value={form.coverUrl}
                      onChange={e => setForm(f => ({ ...f, coverUrl: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleCoverUrl()}
                    />
                    <Button size="sm" variant="outline" className="h-8 px-2 border-[#D9D2C7]" onClick={handleCoverUrl}>
                      <Link size={13} />
                    </Button>
                  </div>
                  {form.coverImage && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-600"
                      onClick={() => setForm(f => ({ ...f, coverImage: null }))}>
                      ลบรูป
                    </Button>
                  )}
                </div>

                {/* Right fields */}
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-[#5C4033] block mb-1">Title <span className="text-red-400">*</span></label>
                    <Input className="bg-white border-[#D9D2C7]" value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#5C4033] block mb-1">Author(s) <span className="text-red-400">*</span></label>
                    <Input className="bg-white border-[#D9D2C7]" placeholder="คั่นด้วย comma ถ้ามีหลายคน"
                      value={form.authors} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-[#5C4033] block mb-1">ISBN</label>
                      <Input className="bg-white border-[#D9D2C7]" value={form.isbn}
                        onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-[#5C4033] block mb-1">Total Pages</label>
                      <Input type="number" min={0} className="bg-white border-[#D9D2C7]" value={form.totalPages}
                        onChange={e => setForm(f => ({ ...f, totalPages: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div ref={categoryRef}>
                <label className="text-sm font-semibold text-[#5C4033] block mb-2">Categories</label>
                <div className="border border-[#D9D2C7] rounded-lg bg-white p-2">
                  {/* Selected tags */}
                  {form.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.categories.map(cat => (
                        <span key={cat} className="flex items-center gap-1 bg-[#C07B5A] text-white text-xs px-2 py-0.5 rounded-full">
                          {cat}
                          <X size={11} className="cursor-pointer" onClick={() => toggleCategory(cat)} />
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Search input */}
                  <div className="flex items-center gap-2 px-1">
                    <Search size={14} className="text-[#8B6F5E] flex-shrink-0" />
                    <input
                      className="flex-1 text-sm bg-transparent outline-none placeholder-[#C4B5A8]"
                      placeholder="พิมพ์เพื่อค้นหาหรือเพิ่มใหม่..."
                      value={categorySearch}
                      onChange={e => { setCategorySearch(e.target.value); setShowCategoryDropdown(true) }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      onKeyDown={addCustomCategory}
                    />
                  </div>
                </div>

                {/* Dropdown */}
                {showCategoryDropdown && (
                  <div className="border border-[#D9D2C7] rounded-lg bg-white mt-1 shadow-md max-h-44 overflow-y-auto">
                    {filteredCategories.map(cat => (
                      <div
                        key={cat}
                        onClick={() => { toggleCategory(cat); setCategorySearch("") }}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-[#FAF9F6] transition-colors ${form.categories.includes(cat) ? "text-[#C4B5A8]" : "text-[#3D2B1F]"}`}
                      >
                        {cat}
                        {form.categories.includes(cat) && <span className="text-[#C07B5A]">✓</span>}
                      </div>
                    ))}
                    {filteredCategories.length === 0 && categorySearch.trim() && (
                      <div className="px-4 py-2.5 text-sm text-[#8B6F5E] italic">
                        กด Enter เพื่อเพิ่ม &quot;{categorySearch}&quot;
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-[#5C4033] block mb-2">Description</label>
                <Textarea
                  placeholder="เรื่องย่อ..."
                  className="bg-white border-[#D9D2C7] resize-none min-h-[100px] focus:border-[#C07B5A]"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="pt-3 flex-shrink-0">
              <Button
                className="w-full bg-[#3D2B1F] hover:bg-[#2E1F15] text-white h-11 text-base font-semibold"
                onClick={handleSaveManual}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Save Book to Library
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}