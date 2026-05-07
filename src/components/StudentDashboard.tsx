"use client";

import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import StudentTable from "./StudentTable";
import { Student } from "@/types/student";

interface Props {
  initialStudents: Student[];
}

export default function StudentDashboard({ initialStudents }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // 刷新列表：提交后调用，保证看到最新数据
  const refetchStudents = async (): Promise<void> => {
    const res = await fetch("/api/students");
    if (!res.ok) return;
    const data = (await res.json()) as Student[];
    setStudents(data);
  };

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">添加 / 编辑学生</h2>
          <span className="text-xs text-slate-500">内置前端校验 + 服务端校验</span>
        </div>
        <div className="mt-5">
          <StudentForm onSaved={refetchStudents} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">学生列表</h2>
          <span className="text-xs text-slate-500">支持编辑与删除</span>
        </div>
        <div className="mt-5">
          <StudentTable initialStudents={students} onRefetch={refetchStudents} />
        </div>
      </div>
    </>
  );
}
