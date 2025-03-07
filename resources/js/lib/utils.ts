import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusOptions = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Canceled' },
];
