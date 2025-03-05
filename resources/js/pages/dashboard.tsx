import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
];

export default function Dashboard({ appName }: { appName: string }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Welcome to {appName} App</h2>
          <p className="text-muted-foreground text-sm">Manage the company processes efficiently from this central dashboard</p>
        </div>
      </div>
    </AppLayout>
  );
}
