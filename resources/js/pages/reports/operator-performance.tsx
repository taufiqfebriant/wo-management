import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type OperatorPerformance, type PaginationResponse2 } from '@/types';
import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from './data-table';

interface Props {
  performance: PaginationResponse2<OperatorPerformance>;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Reports',
    href: '/reports',
  },
  {
    title: 'Operator Performance',
    href: '/reports/operator-performance',
  },
];

export default function OperatorPerformanceReport({ performance }: Props) {
  const columns = useMemo<ColumnDef<OperatorPerformance>[]>(
    () => [
      {
        accessorKey: 'operator_name',
        header: 'Operator',
      },
      {
        accessorKey: 'product_name',
        header: 'Product',
        cell: (ctx) => `${ctx.row.original.product_name ?? '-'}`,
      },
      {
        accessorKey: 'completed_orders',
        header: 'Completed Orders',
        cell: (ctx) => `${ctx.row.original.completed_orders ?? 0}`,
      },
      {
        accessorKey: 'completed_quantity',
        header: 'Total Quantity',
        cell: (ctx) => `${ctx.row.original.completed_quantity ?? 0} units`,
      },
    ],
    [],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Operator Performance Report" />

      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Operator Performance</h2>
            <p className="text-muted-foreground text-sm">View performance metrics for operators by product</p>
          </div>
        </div>

        <div className="mt-6" />

        <DataTable columns={columns} data={performance.data} pageCount={performance.last_page} rowCount={performance.total} />

        <div className="mt-4 flex justify-end">
          <Pagination className="mx-[unset] w-[unset]">
            <PaginationContent>
              {performance.links.map((link) => (
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
