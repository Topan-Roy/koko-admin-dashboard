import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeHexColor = (color: string) =>
  color.startsWith("#") ? color : `#${color}`;

export const isValidHexColor = (color: string) =>
  /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(color.trim());

export function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const escapeField = (field: any) => {
    const stringVal = field === null || field === undefined ? '' : String(field);
    return `"${stringVal.replace(/"/g, '""')}"`;
  };
  const csvContent = [
    headers.map(escapeField).join(','),
    ...rows.map(row => row.map(escapeField).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
