import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validations";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ message: "获取学生列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentSchema.parse(body);
    const student = await prisma.student.create({
      data: parsed,
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ message: "邮箱已存在，请使用其他邮箱。" }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "创建学生失败，请稍后再试";
    return NextResponse.json({ message }, { status: 400 });
  }
}
