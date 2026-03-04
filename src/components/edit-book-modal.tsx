"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X, Upload, Link, Trash2, Loader2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { uploadBookCover } from "@/actions/upload"
import { updateBookDetails } from "@/actions/book"
import { useRef } from "react"

const PRESET_CATEGORIES = [
  "Business", "Self-help", "Fantasy", "Science", "Biography",
  "Mystery", "Romance", "History", "Technology", "Fiction",
  "Non-fiction", "Psychology", "Philosophy", "Art", "Travel",
  "Cooking", "Health", "Sports", "Politics", "Education",
]

interface EditBookModalProps {
  book: {
    id: string
    title: string
    author: string
    isbn: string | null
    totalPages: number | null
    description: string | null
    coverImage: string | null
    categories: { category: { name: string } }[]
  }
}

export function EditBookModal({ book }: EditBookModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    title: book.title,
    authors: book.author,
    isbn: book.isbn || "",
    totalPages: book.totalPages?.toString() || "",
    description: book.description || "",
    coverImage: book.coverImage,
    coverUrl: "",
    categories: book.categories.map(c => c.category.name),
  })

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      setIsUploadingCover(true)
      try {
        const uploadRes = await uploadBookCover(reader.result as string)
        if (uploadRes.success) setForm(f => ({ ...f, coverImage: uploadRes.url!, coverUrl: "" }))
        else alert("อัพโหลดรูปปกไม่สำเร็จ")
      } finally { setIsUploadingCover(false) }
    }
    reader.readAsDataURL(file)
  }

  const handleCoverUrl = () => {
    if (form.coverUrl.trim()) setForm(f => ({ ...f, coverImage: f.coverUrl, coverUrl: "" }))
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
      if (!form.categories.includes(newCat)) setForm(f => ({ ...f, categories: [...f.categories, newCat] }))
      setCategorySearch("")
    }
  }

  const filteredCategories = PRESET_CATEGORIES.filter(c =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const handleSave = async () => {
    if (!form.title.trim() || !form.authors.trim() || !form.totalPages) {
      alert("กรุณากรอก Title, Author(s) และ Total Pages")
      return
    }
    if (isUploadingCover) { alert("กรุณารอให้อัพโหลดรูปปกเสร็จก่อน"); return }

    setIsSaving(true)
    try {
      const result = await updateBookDetails(book.id, {
        title: form.title.trim(),
        authors: form.authors.split(",").map(a => a.trim()).filter(Boolean),
        isbn: form.isbn.trim() || null,
        totalPages: parseInt(form.totalPages),
        description: form.description.trim() || null,
        coverImage: form.coverImage,
        categories: form.categories,
      })
      if (result.success) { setIsOpen(false); router.refresh() }
      else alert("เกิดข้อผิดพลาดในการบันทึก")
    } finally { setIsSaving(false) }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D9D2C7] bg-white text-[#8B6F5E] hover:border-[#C07B5A] hover:text-[#C07B5A] transition-colors"
        title="แก้ไขข้อมูลหนังสือ"
      >
        <Pencil size={15} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[520px] max-w-[95vw] bg-[#FAF9F6] border-[#D9D2C7] flex flex-col max-h-[90vh] [&>button]:hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D2C7] flex-shrink-0">
            <DialogTitle className="text-[#5C4033] font-bold text-[16px]">แก้ไขข้อมูลหนังสือ</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-[#EDE8DF] hover:bg-[#D9D2C7] flex items-center justify-center text-[#8B6F5E] transition-colors">
              <X size={13} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-5 pt-2">
            {/* Cover + Fields */}
            <div className="flex gap-4">
              {/* Cover */}
              <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: 110 }}>
                <p className="text-sm font-semibold text-[#5C4033]">Book Cover</p>
                <div
                  onClick={() => !isUploadingCover && fileInputRef.current?.click()}
                  style={{ aspectRatio: "2/3" }}
                  className="relative w-full border-2 border-dashed border-[#D9D2C7] rounded-lg cursor-pointer hover:border-[#C07B5A] transition-colors bg-white overflow-hidden"
                >
                  {isUploadingCover ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white">
                      <Loader2 size={22} className="text-[#C07B5A] animate-spin" />
                      <span className="text-[10px] text-[#C4B5A8]">กำลังอัพโหลด...</span>
                    </div>
                  ) : form.coverImage ? (
                    <img src={form.coverImage} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <Upload size={20} className="text-[#C4B5A8]" />
                      <span className="text-[11px] text-[#C4B5A8] text-center leading-tight px-1">อัพโหลด</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
                <div className="flex gap-1">
                  <Input placeholder="วางลิงก์..." className="bg-white text-xs h-8 flex-1 min-w-0"
                    value={form.coverUrl} onChange={e => setForm(f => ({ ...f, coverUrl: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleCoverUrl()} />
                  <Button size="sm" variant="outline" className="h-8 px-2 border-[#D9D2C7]" onClick={handleCoverUrl}>
                    <Link size={13} />
                  </Button>
                </div>
                {form.coverImage && !isUploadingCover && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                    onClick={() => setForm(f => ({ ...f, coverImage: null }))}>
                    <Trash2 size={12} /> ลบรูปปก
                  </Button>
                )}
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <label className="text-sm font-semibold text-[#5C4033] block mb-1">Title <span className="text-red-400">*</span></label>
                  <Input className="bg-white border-[#D9D2C7]" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#5C4033] block mb-1">Author(s) <span className="text-red-400">*</span></label>
                  <Input className="bg-white border-[#D9D2C7]" placeholder="คั่นด้วย comma ถ้ามีหลายคน"
                    value={form.authors} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-[#5C4033] block mb-1">ISBN</label>
                    <Input className="bg-white border-[#D9D2C7]" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-[#5C4033] block mb-1">Total Pages <span className="text-red-400">*</span></label>
                    <Input type="number" min={1} className="bg-white border-[#D9D2C7]" value={form.totalPages}
                      onChange={e => setForm(f => ({ ...f, totalPages: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div ref={categoryRef}>
              <label className="text-sm font-semibold text-[#5C4033] block mb-2">Categories</label>
              <div className="border border-[#D9D2C7] rounded-lg bg-white p-2">
                {form.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.categories.map(cat => (
                      <span key={cat} className="flex items-center gap-1 bg-[#C07B5A] text-white text-xs px-2 py-0.5 rounded-full">
                        {cat} <X size={11} className="cursor-pointer" onClick={() => toggleCategory(cat)} />
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 px-1">
                  <Search size={14} className="text-[#8B6F5E] flex-shrink-0" />
                  <input className="flex-1 text-sm bg-transparent outline-none placeholder-[#C4B5A8]"
                    placeholder="พิมพ์เพื่อค้นหาหรือเพิ่มใหม่..."
                    value={categorySearch}
                    onChange={e => { setCategorySearch(e.target.value); setShowCategoryDropdown(true) }}
                    onFocus={() => setShowCategoryDropdown(true)}
                    onKeyDown={addCustomCategory} />
                </div>
              </div>
              {showCategoryDropdown && (
                <div className="border border-[#D9D2C7] rounded-lg bg-white mt-1 shadow-md max-h-44 overflow-y-auto">
                  {filteredCategories.map(cat => (
                    <div key={cat} onClick={() => { toggleCategory(cat); setCategorySearch("") }}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-[#FAF9F6] ${form.categories.includes(cat) ? "text-[#C4B5A8]" : "text-[#3D2B1F]"}`}>
                      {cat}
                      {form.categories.includes(cat) && <span className="text-[#C07B5A]">✓</span>}
                    </div>
                  ))}
                  {filteredCategories.length === 0 && categorySearch.trim() && (
                    <div className="px-4 py-2.5 text-sm text-[#8B6F5E] italic">กด Enter เพื่อเพิ่ม &quot;{categorySearch}&quot;</div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-[#5C4033] block mb-2">Description</label>
              <Textarea placeholder="เรื่องย่อ..." className="bg-white border-[#D9D2C7] resize-none min-h-[90px]"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>

          <div className="pt-3 flex-shrink-0">
            <Button className="w-full bg-[#3D2B1F] hover:bg-[#2E1F15] text-white h-11 text-base font-semibold"
              onClick={handleSave} disabled={isSaving || isUploadingCover}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isUploadingCover ? "กำลังอัพโหลดรูป..." : isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}