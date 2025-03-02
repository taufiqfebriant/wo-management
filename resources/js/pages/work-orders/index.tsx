import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
];

export default function WorkOrders() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Work Orders" />

      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Work Orders</h2>
            <p className="text-muted-foreground text-sm">Manage and track the status of work orders</p>
          </div>

          <Button asChild>
            <Link href="/work-orders/create">Create</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
