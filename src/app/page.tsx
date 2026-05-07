import { listStudents } from "@/app/actions/studentActions";
import StudentDashboard from "@/components/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const students = await listStudents();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 p-[1px] shadow-lg">
          <div className="flex flex-col gap-3 rounded-3xl bg-white/90 px-8 py-7 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">TypeScript</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Next.js App Router</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Prisma + MySQL</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">学生管理系统</h1>
                <p className="mt-2 text-sm text-slate-600">
                  轻量的增删改查示例，演示数据校验、API 与数据库的完整流转，适合课堂实训快速上手。
                </p>
              </div>
              <div className="rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow">
                <p>状态：示例项目</p>
                <p className="mt-1 text-slate-300">可按需扩展分页、搜索、鉴权等功能</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <StudentDashboard initialStudents={students} />
        </section>
      </div>
    </main>
  );
}
