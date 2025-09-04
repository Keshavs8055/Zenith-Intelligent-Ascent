import bcrypt from "bcryptjs";
import { format, parseISO } from "date-fns";
import { randomUUID } from "crypto";

export const formatDate = (date: string | Date) => {
  return format(typeof date === "string" ? parseISO(date) : date, "PPpp");
};

export const generateId = () => randomUUID();

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json();
}
