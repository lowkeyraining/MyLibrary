// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // 1. สร้าง User จำลอง (หรือใช้ User เดิมถ้ามีอยู่แล้ว)
  const password = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demoreader',
      name: 'Demo Reader',
      password,
      // สร้างเป้าหมายการอ่านปี 2026 ให้เลย
      goals: {
        create: {
          year: 2026,
          targetBooks: 24
        }
      }
    },
  })

  console.log(`👤 Created/Found user: ${user.name}`)

  // 2. ข้อมูลหนังสือที่จะ Seed
  const booksData = [
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 215,
      status: 'READING',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
    },
    {
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      totalPages: 252,
      status: 'COMPLETED',
      currentPage: 252,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81Dky+tD+pL.jpg',
    },
    {
      title: 'Deep Work',
      author: 'Cal Newport',
      totalPages: 304,
      status: 'WANT_TO_READ',
      currentPage: 0,
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      totalPages: 443,
      status: 'READING',
      currentPage: 120,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      totalPages: 464,
      status: 'COMPLETED',
      currentPage: 464,
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      totalPages: 616,
      status: 'DROPPED',
      currentPage: 150,
    },
    {
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      totalPages: 496,
      status: 'WANT_TO_READ',
      currentPage: 0,
    },
  ]

  // 3. วนลูปสร้างหนังสือ
  for (const book of booksData) {
    await prisma.book.create({
      data: {
        ...book,
        userId: user.id, // ผูกกับ User ที่เราเพิ่งสร้าง
      }
    })
  }

  console.log(`📚 Seeded ${booksData.length} books`)
  console.log('✅ Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })