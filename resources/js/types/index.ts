import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  items?: NavItem[];
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  flash: { message: string };
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export type Product = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginationResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
};

export interface WorkOrderSummary {
  product_name: string;
  pending_count: number;
  in_progress_count: number;
  completed_count: number;
  canceled_count: number;
  pending_quantity: number;
  in_progress_quantity: number;
  completed_quantity: number;
  canceled_quantity: number;
}

export interface OperatorPerformance {
  operator_name: string;
  product_name: string;
  completed_orders: number;
  completed_quantity: number;
}
