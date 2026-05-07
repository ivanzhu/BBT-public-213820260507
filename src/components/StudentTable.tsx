"use client";

import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import StudentForm from "./StudentForm";

interface Props {
  initialStudents: Student[];
  onRefetch?: () => Promise<void>;
}

export default function StudentTable({ initialStudents, onRefetch }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editingId, setEditingId] = useState<number | null>(null);
  const currentEditing = students.find((s) => s.id === editingId) || null;

  // 重新获取列表，保证操作后数据最新
  async function refresh() {
    if (onRefetch) {
      await onRefetch();
      return;
    }
    const res = await fetch("/api/students");
    if (!res.ok) return;
    const data = await res.json();
    setStudents(data);
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("确定要删除该学生吗？");
    if (!confirmDelete) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("删除失败，请稍后重试");
    }
  }

  useEffect(() => {
    // 当 initialStudents 变化时同步（SSR 首次渲染后仅用于初始值）
    setStudents(initialStudents);
  }, [initialStudents]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-600">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">姓名</th>
            <th className="px-4 py-3">邮箱</th>
            <th className="px-4 py-3 hidden md:table-cell">专业</th>
            <th className="px-4 py-3 hidden md:table-cell">入学年份</th>
            <th className="px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">{student.id}</td>
              <td className="px-4 py-3">{student.name}</td>
              <td className="px-4 py-3">{student.email}</td>
              <td className="px-4 py-3 hidden md:table-cell">{student.major}</td>
              <td className="px-4 py-3 hidden md:table-cell">{student.enrollmentYear}</td>
              <td className="px-4 py-3 flex flex-wrap gap-1">
                <button
                  onClick={() => setEditingId(student.id)}
                  className="rounded-md bg-amber-500 px-3 py-1 text-white transition hover:-translate-y-[1px] hover:bg-amber-600 hover:shadow-sm cursor-pointer"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="rounded-md bg-rose-500 px-3 py-1 text-white transition hover:-translate-y-[1px] hover:bg-rose-600 hover:shadow-sm cursor-pointer"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                还没有学生数据，请先添加。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingId && (
        <EditDrawer
          student={currentEditing}
          onClose={() => setEditingId(null)}
          onUpdated={refresh}
        />
      )}
    </div>
  );
}

interface EditDrawerProps {
  student: Student | null;
  onClose: () => void;
  onUpdated: () => void;
}

function EditDrawer({ student, onClose, onUpdated }: EditDrawerProps) {
  const [form, setForm] = useState(() => ({
    name: student?.name ?? "",
    email: student?.email ?? "",
    major: student?.major ?? "",
    enrollmentYear: student?.enrollmentYear ?? new Date().getFullYear(),
  }));

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        major: student.major,
        enrollmentYear: student.enrollmentYear,
      });
    }
  }, [student]);

  if (!student) return null;

  async function handleUpdate() {
    if (!student) return;
    const res = await fetch(`/api/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      onUpdated();
      onClose();
    } else {
      alert("更新失败，请检查数据格式");
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">编辑学生 #{student.id}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:-translate-y-[1px] hover:text-slate-700 cursor-pointer"
          >
            关闭
          </button>
        </div>
        <div className="mt-4 grid gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-slate-700">姓名</span>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-700">邮箱</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-700">专业</span>
            <input
              value={form.major}
              onChange={(e) =>
                setForm((p) => ({ ...p, major: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-700">入学年份</span>
            <input
              type="number"
              min={2000}
              max={new Date().getFullYear()}
              value={form.enrollmentYear}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  enrollmentYear: Number(e.target.value),
                }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-sm cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleUpdate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-indigo-700 hover:shadow-md cursor-pointer"
          >
            保存
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          说明：编辑窗口简单呈现，实际项目可拆分为可复用组件或使用表单库。
        </p>
      </div>
    </div>
  );
}
