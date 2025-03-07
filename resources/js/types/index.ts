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
  routeName: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  items?: NavItem[];
  permissions?: string[];
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  flash: { message: string };
  [key: string]: unknown;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  permissions: Permission[];
  roles: Role[];
  [key: string]: unknown;
}

export type Product = {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type WorkOrderProgress = {
  id: number;
  progress_notes: string;
  created_at: string | null;
  updated_at: string | null;
  user?: User;
  work_order?: WorkOrder;
};

export type WorkOrderUpdate = {
  id: number;
  previous_status: number;
  new_status: number;
  quantity_processed: number;
  created_at: string | null;
  updated_at: string | null;
  user?: User;
  work_order?: WorkOrder;
};

export type WorkOrder = {
  id: number;
  number: string;
  product?: Product;
  quantity: number;
  deadline: string;
  status: number;
  user?: User;
  created_at: string | null;
  updated_at: string | null;
  work_order_progress?: WorkOrderProgress[];
  work_order_updates?: WorkOrderUpdate[];
};

export type Pagination<T> = {
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

export type PaginationResponse2<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
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
