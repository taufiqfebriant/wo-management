import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Box, ClipboardList, FileText, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: route('dashboard'),
    icon: LayoutGrid,
  },
  {
    title: 'Products',
    url: route('products.index'),
    icon: Box,
    permissions: ['read products'],
  },
  {
    title: 'Work Orders',
    url: route('work-orders.index'),
    icon: ClipboardList,
    permissions: ['read work orders'],
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
    permissions: ['read work order summary report', 'read operator performance report'],
    items: [
      {
        title: 'Work Order Summary',
        url: route('reports.work-order-summary'),
        permissions: ['read work order summary report'],
      },
      {
        title: 'Operator Performance',
        url: route('reports.operator-performance'),
        permissions: ['read operator performance report'],
      },
    ],
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('dashboard')} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
