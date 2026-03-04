"use server"

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// สำหรับรูปโปรไฟล์ — crop 200x200
export async function uploadProfileImage(base64Image: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_images",
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    })
    return { success: true, url: result.secure_url }
  } catch (error) {
    return { success: false, url: null }
  }
}

// สำหรับรูปปกหนังสือ — ไม่ resize เพื่อให้คมชัด
export async function uploadBookCover(base64Image: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "book_covers",
    })
    return { success: true, url: result.secure_url }
  } catch (error) {
    return { success: false, url: null }
  }
}