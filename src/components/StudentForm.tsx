"use client";

import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { StudentInput, studentSchema } from "@/lib/validations";

interface Props {
  editingStudent?: Student | null;
  onSaved?: () => Promise<void> | void;
  onCancelEdit?: () => void;
}

type Status = { type: "idle" } | { type: "error"; message: string } | { type: "success"; message: string };

export default function StudentForm({ editingStudent = null, onSaved, onCancelEdit }: Props) {
  const [form, setForm] = useState<StudentInput>({
    name: "",
    email: "",
    major: "",
    enrollmentYear: new Date().getFullYear(),
  });
  const [status, setStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    if (editingStudent) {
      // 当用户点击“编辑”时，回填表单
      const { name, email, major, enrollmentYear } = editingStudent;
      setForm({ name, email, major, enrollmentYear });
    }
  }, [editingStudent]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      major: "",
      enrollmentYear: new Date().getFullYear(),
    });
    setStatus({ type: "idle" });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });

    // 1) 前端做一次校验，帮助学生理解数据检查
    const result = studentSchema.safeParse({ ...form, enrollmentYear: Number(form.enrollmentYear) });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "请输入正确的数据";
      setStatus({ type: "error", message: firstError });
      return;
    }

    const payload = result.data;
    const isEditing = Boolean(editingStudent);
    const url = isEditing ? `/api/students/${editingStudent?.id}` : "/api/students";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.message || "请求失败");
      }

      setStatus({ type: "success", message: isEditing ? "更新成功" : "创建成功" });
      await onSaved?.();
      if (!isEditing) {
        resetForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "提交失败，请稍后再试";
      setStatus({ type: "error", message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-slate-700">姓名</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            placeholder="例如：张三"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-slate-700">邮箱</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            placeholder="例如：student@example.com"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-slate-700">专业</span>
          <input
            required
            value={form.major}
            onChange={(e) => setForm((prev) => ({ ...prev, major: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            placeholder="例如：软件工程"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-slate-700">入学年份</span>
          <input
            required
            type="number"
            min={2000}
            max={new Date().getFullYear()}
            value={form.enrollmentYear}
            onChange={(e) => setForm((prev) => ({ ...prev, enrollmentYear: Number(e.target.value) }))}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-400 focus:outline-none"
            placeholder="例如：2023"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-indigo-700 hover:shadow-md cursor-pointer"
        >
          {editingStudent ? "保存修改" : "添加学生"}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            onCancelEdit?.();
          }}
          className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-sm cursor-pointer"
        >
          {editingStudent ? "取消编辑" : "重置"}
        </button>
      </div>

      {status.type === "error" && <p className="text-sm text-red-600">提示：{status.message}</p>}
      {status.type === "success" && <p className="text-sm text-green-600">{status.message}</p>}

      <p className="text-xs text-slate-500">
        小贴士：此处采用受控组件，结合 zod 做前端校验，后端 API 再做一次校验，确保数据安全。
      </p>
    </form>
  );
}
