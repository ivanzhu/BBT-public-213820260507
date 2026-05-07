## 学生管理系统（Next.js + TypeScript + Prisma + MySQL）

一个面向课程实训的简单全栈示例：使用 TypeScript 与 Next.js App Router，结合 Prisma + MySQL，实现学生的增删改查。界面使用 Tailwind，代码含中文注释，便于理解。

> ⚠️ 运行前请确保数据库已启动，并执行 `pnpm prisma:db:push` 初始化表，否则会出现 “Student 表不存在” 或连接超时错误。

### 功能概览
- 学生列表展示
- 添加 / 编辑 / 删除学生
- Prisma 数据模型与简单种子数据

### 目录结构
- `src/app`：页面与 API（`/api/students`）
- `src/components`：前端组件（表单、表格）
- `src/lib`：Prisma 客户端、校验
- `prisma/`：Prisma 模型与种子脚本
- `docker-compose.yml`：前端 + MySQL 服务编排

### 开发环境运行
1. 安装依赖：`pnpm install`
2. 配置数据库：`cp .env.example .env`（如需）并设置 `DATABASE_URL`。  
   - 本地示例：`mysql://root:password@localhost:3306/student_db`  
   - Docker 示例：`mysql://root:password@db:3306/student_db`
3. 初始化数据库：`pnpm prisma:db:push`（必要），可选 `pnpm prisma:seed` 导入示例数据。
4. 启动开发：`pnpm dev`，访问 http://localhost:3000

### Docker 运行
1. `docker-compose up -d`（包含前端与 MySQL）
2. 确认环境变量 `DATABASE_URL` 指向容器内数据库：`mysql://root:password@db:3306/student_db`
3. 进入容器或本机执行 `pnpm prisma:db:push` 与可选 `pnpm prisma:seed`

### 说明
- 代码全部使用 TypeScript，并使用 Zod 做数据校验。
- 简化实现适合教学演示，可在此基础上继续扩展（如分页、搜索、鉴权等）。
