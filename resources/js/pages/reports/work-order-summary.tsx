import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginationResponse2, type WorkOrderSummary } from '@/types';
import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from './data-table';

interface Props {
  summary: PaginationResponse2<WorkOrderSummary>;
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
        cell: (ctx) => `${ctx.row.original.pending_count} (${ctx.row.original.pending_quantity ?? 0} units)`,
      },
      {
        id: 'in_progress',
        header: 'In Progress',
        cell: (ctx) => `${ctx.row.original.in_progress_count} (${ctx.row.original.in_progress_quantity ?? 0} units)`,
      },
      {
        id: 'completed',
        header: 'Completed',
        cell: (ctx) => `${ctx.row.original.completed_count} (${ctx.row.original.completed_quantity ?? 0} units)`,
      },
      {
        id: 'canceled',
        header: 'Canceled',
        cell: (ctx) => `${ctx.row.original.canceled_count} (${ctx.row.original.canceled_quantity ?? 0} units)`,
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

        <DataTable columns={columns} data={summary.data} pageCount={summary.last_page} rowCount={summary.total} />

        <div className="mt-4 flex justify-end">
          <Pagination className="mx-[unset] w-[unset]">
            <PaginationContent>
              {summary.links.map((link) => (
                <PaginationItem key={link.label}>
                  <PaginationLink
                    href={link.url ?? '#'}
                    isActive={link.active}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    size={link.label.toLowerCase().includes('previous') || link.label.toLowerCase().includes('next') ? 'default' : 'icon'}
                    {...(!link.url || link.active ? { as: 'button', disabled: true } : {})}
                  />
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </AppLayout>
  );
}
