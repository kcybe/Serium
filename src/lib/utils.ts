import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToJson(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function importFromJson(file: File): Promise<any> {
  try {
    const text = await file.text()
    return JSON.parse(text)
  } catch (error) {
    throw new Error('Invalid JSON file')
  }
}