import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date)
}
