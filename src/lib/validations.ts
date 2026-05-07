import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "姓名不能为空")
    .max(100, "姓名长度不能超过 100 个字符"),
  email: z
    .string()
    .email("请输入正确的邮箱格式")
    .max(160, "邮箱长度不能超过 160 个字符"),
  major: z
    .string()
    .min(1, "专业不能为空")
    .max(120, "专业长度不能超过 120 个字符"),
  enrollmentYear: z
    .number({
      // zod v4 使用 `message` 提示类型错误
      message: "入学年份必须是数字",
    })
    .int("入学年份必须是整数")
    .min(2000, "入学年份应大于 2000")
    .max(new Date().getFullYear(), "入学年份不能超过当前年份"),
});

export type StudentInput = z.infer<typeof studentSchema>;
