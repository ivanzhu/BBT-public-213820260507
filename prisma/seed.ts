import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

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

const prisma = new PrismaClient({ adapter });

async function main() {
  const baseStudents = [
    { name: "张伟", email: "zhangwei@example.com", major: "计算机科学", enrollmentYear: 2022 },
    { name: "李娜", email: "lina@example.com", major: "软件工程", enrollmentYear: 2023 },
    { name: "王强", email: "wangqiang@example.com", major: "信息管理", enrollmentYear: 2021 },
  ];

  await prisma.student.createMany({
    data: baseStudents,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
