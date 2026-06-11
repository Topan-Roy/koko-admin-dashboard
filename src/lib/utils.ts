import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeHexColor = (color: string) =>
  color.startsWith("#") ? color : `#${color}`;

export const isValidHexColor = (color: string) =>
  /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(color.trim());
