import type { WorkOrder } from '@/types';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
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

export function getWorkOrderStatusString(status: WorkOrder['status']) {
  return statusOptions.find((option) => option.value === status)?.label || 'Unknown';
}

export const workOrderStatus = {
  pending: 0,
  inProgress: 1,
  completed: 2,
  canceled: 3,
};
