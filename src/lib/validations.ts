import { z } from "zod";

export const factSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Judul harus minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  content: z
    .string()
    .trim()
    .min(10, "Konten harus minimal 10 karakter")
    .max(5000, "Konten maksimal 5000 karakter"),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong")
    .max(2000, "Komentar maksimal 2000 karakter"),
});

export const chatMessageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000, "Pesan terlalu panjang"),
      })
    )
    .max(20, "Terlalu banyak pesan dalam percakapan"),
});

export const authSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
    .optional(),
});

export const fileUploadSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
  type: z.enum(["image/png", "image/jpeg", "image/jpg"], {
    errorMap: () => ({ message: "File harus berformat PNG atau JPEG" }),
  }),
});
