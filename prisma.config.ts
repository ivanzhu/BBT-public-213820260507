// Prisma 配置，支持 .env 加载，便于 Docker 构建时提供数据库连接。
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env["DATABASE_URL"] ||
      "mysql://root:password@localhost:3306/student_db",
  },
});
