import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 解析 DATABASE_URL，兼容本地和 Docker（默认本地端口）
const databaseUrl =
  process.env.DATABASE_URL || "mysql://root:password@localhost:3306/student_db";
const parsed = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: Number(parsed.port) || 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, ""),
});

export const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});
