import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type WorkOrderSummary } from '@/types';
import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from './data-table';

interface Props {
  summary: WorkOrderSummary[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Reports',
    href: '/reports',
  },
  {
    title: 'Work Order Summary',
    href: '/reports/work-order-summary',
  },
];

export default function WorkOrderSummaryReport({ summary }: Props) {
  const columns = useMemo<ColumnDef<WorkOrderSummary>[]>(
    () => [
      {
        accessorKey: 'product_name',
        header: 'Product',
      },
      {
        id: 'pending',
        header: 'Pending',
        cell: (ctx) => (
          <div className="text-right">
            {ctx.row.original.pending_count} ({ctx.row.original.pending_quantity})
          </div>
        ),
      },
      {
        id: 'in_progress',
        header: 'In Progress',
        cell: (ctx) => (
          <div className="text-right">
            {ctx.row.original.in_progress_count} ({ctx.row.original.in_progress_quantity})
          </div>
        ),
      },
      {
        id: 'completed',
        header: 'Completed',
        cell: (ctx) => (
          <div className="text-right">
            {ctx.row.original.completed_count} ({ctx.row.original.completed_quantity})
          </div>
        ),
      },
      {
        id: 'canceled',
        header: 'Canceled',
        cell: (ctx) => (
          <div className="text-right">
            {ctx.row.original.canceled_count} ({ctx.row.original.canceled_quantity})
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Work Order Summary Report" />

      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Work Order Summary</h2>
            <p className="text-muted-foreground text-sm">View summary of work orders by product and status</p>
          </div>
        </div>

        <div className="mt-6" />

        <DataTable columns={columns} data={summary} pageCount={1} rowCount={summary.length} />
      </div>
    </AppLayout>
  );
}
