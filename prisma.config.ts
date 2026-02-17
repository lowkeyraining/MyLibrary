import "dotenv/config";
// แก้ไขบรรทัดนี้จาก "prisma/config" เป็น "@prisma/config"
import { defineConfig } from "@prisma/config"; 

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});