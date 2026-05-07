# 学生管理系统（TypeScript + Next.js + Prisma + MySQL）

这是一个面向大学生 TypeScript 课程实训的简单全栈项目。项目使用 Next.js App Router 编写页面和接口，使用 Prisma 连接 MySQL 数据库，实现学生信息的新增、查询、修改和删除。

项目代码全部使用 TypeScript 编写，并通过类型定义、接口和模块化目录拆分来保持代码清晰，便于学习和后续扩展。

> ⚠️ 运行前请确保数据库已启动，并执行 `pnpm prisma:db:push` 初始化表，否则会出现 “Student 表不存在” 或连接超时错误。

## 功能概览

- 学生列表展示
- 添加学生信息
- 编辑学生信息
- 删除学生信息
- 使用 Zod 对表单数据做基础校验
- 使用 Prisma 管理 MySQL 数据表和示例数据

## 技术栈

- TypeScript：主要开发语言
- Next.js：页面、组件和 API 路由
- React：前端交互组件
- Prisma：数据库模型和 MySQL 访问
- MySQL：学生数据存储
- Tailwind CSS：页面样式

## 目录结构

- `src/app`：页面与 API（`/api/students`）
- `src/components`：学生表单、学生表格和管理面板组件
- `src/lib`：Prisma 客户端和数据校验方法
- `src/types`：学生相关 TypeScript 类型
- `prisma/schema.prisma`：Prisma 数据模型
- `prisma/seed.ts`：初始化示例学生数据
- `scripts/docker-entrypoint.sh`：Docker 一体化启动脚本
- `.env.example`：数据库连接配置示例

## 本地开发运行

1. 安装依赖：`pnpm install`
2. 准备 MySQL 数据库，例如创建名为 `student_db` 的数据库。
3. 复制环境变量示例：`cp .env.example .env`
4. 修改 `.env` 中的 `DATABASE_URL`，示例：

```env
DATABASE_URL="mysql://root:password@localhost:3306/student_db"
```

5. 生成 Prisma 客户端：`pnpm prisma:generate`
6. 初始化数据库表：`pnpm prisma:db:push`
7. 可选：导入示例数据：`pnpm prisma:seed`
8. 启动开发：`pnpm dev`，访问 http://localhost:3000

## Dockerfile 使用说明

当前 Dockerfile 是教学用的一体化镜像：容器内会同时启动数据库服务和 Next.js 开发服务。启动时会自动完成数据库初始化、`prisma generate` 和 `prisma db push`。

在 `repo` 目录下构建镜像：

```bash
docker build -f ../Dockerfile -t student-management-system .
```

运行容器时传入数据库连接：

```bash
docker run --rm -p 3000:3000 -p 3306:3306 student-management-system
```

默认数据库配置：

- 数据库地址：`127.0.0.1:3306`
- 数据库名：`student_db`
- root 密码：`password`
- 应用连接：`mysql://root:password@127.0.0.1:3306/student_db`

如果本机已经占用 3306 端口，可以只映射前端端口：

```bash
docker run --rm -p 3000:3000 student-management-system
```

## 常用脚本

- `pnpm dev`：启动开发服务
- `pnpm build`：构建生产版本
- `pnpm start`：启动生产服务
- `pnpm prisma:generate`：生成 Prisma 客户端
- `pnpm prisma:db:push`：根据 Prisma 模型同步数据库表
- `pnpm prisma:seed`：写入示例学生数据

## 说明

- 代码全部使用 TypeScript，并使用 Zod 做数据校验。
- 项目实现保持简单，适合期末实训或课程演示。
- 后续可以继续扩展分页、搜索、登录鉴权、班级管理等功能。
