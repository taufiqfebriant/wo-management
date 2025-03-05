import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type OperatorPerformance } from '@/types';
import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from './data-table';

interface Props {
  performance: OperatorPerformance[];
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
      },
      {
        accessorKey: 'completed_orders',
        header: 'Completed Orders',
        cell: (ctx) => <div className="text-right">{ctx.row.original.completed_orders}</div>,
      },
      {
        accessorKey: 'completed_quantity',
        header: 'Total Quantity',
        cell: (ctx) => <div className="text-right">{ctx.row.original.completed_quantity}</div>,
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

        <DataTable columns={columns} data={performance} pageCount={1} rowCount={performance.length} />
      </div>
    </AppLayout>
  );
}
