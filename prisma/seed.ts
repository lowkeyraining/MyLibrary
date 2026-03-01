// prisma/seed.ts
import { PrismaClient, ReadingStatus } from '@prisma/client' // ✅ เพิ่ม ReadingStatus
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  const password = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demoreader',
      name: 'Demo Reader',
      password,
      goals: {
        create: {
          year: 2026,
          targetBooks: 24 // Moderate goal ตาม Spec
        }
      }
    },
  })

  console.log(`👤 Created/Found user: ${user.name}`)

  // 2. ข้อมูลหนังสือ (ใช้ Enum แทน String)
  const booksData = [
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 215,
      status: ReadingStatus.READING, // ✅ แก้จาก 'READING'
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
    },
    {
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      totalPages: 252,
      status: ReadingStatus.COMPLETED, // ✅ แก้จาก 'COMPLETED'
      currentPage: 252,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81Dky+tD+pL.jpg',
    },
    {
      title: 'Deep Work',
      author: 'Cal Newport',
      totalPages: 304,
      status: ReadingStatus.WANT_TO_READ, // ✅ แก้จาก 'WANT_TO_READ'
      currentPage: 0,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      totalPages: 443,
      status: ReadingStatus.READING,
      currentPage: 120,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      totalPages: 464,
      status: ReadingStatus.COMPLETED,
      currentPage: 464,
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      totalPages: 616,
      status: ReadingStatus.DROPPED, // ✅ แก้จาก 'DROPPED'
      currentPage: 150,
    }
  ]

  for (const book of booksData) {
    await prisma.book.create({
      data: {
        ...book,
        userId: user.id,
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