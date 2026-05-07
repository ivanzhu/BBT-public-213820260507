"use server";

import { prisma } from "@/lib/prisma";
import { studentSchema, type StudentInput } from "@/lib/validations";

export async function listStudents() {
  return prisma.student.findMany({ orderBy: { id: "asc" } });
}

export async function createStudent(data: StudentInput) {
  const parsed = studentSchema.parse(data);
  return prisma.student.create({ data: parsed });
}

export async function updateStudent(id: number, data: StudentInput) {
  const parsed = studentSchema.parse(data);
  return prisma.student.update({ where: { id }, data: parsed });
}

export async function deleteStudent(id: number) {
  return prisma.student.delete({ where: { id } });
}
