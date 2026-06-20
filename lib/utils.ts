import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formateDate(date: string){
  const d = new Date(date)
  if (!date || isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US',{
    day:"numeric",
    month:"long",
    year:"numeric"
  })
}
