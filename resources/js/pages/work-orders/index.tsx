import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PaginationResponse, SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
];

type Product = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
};

type WorkOrder = {
  id: number;
  number: string;
  product: Product;
  quantity: number;
  deadline: string;
  status: string;
  operator: User;
  created_at: string;
  updated_at: string;
};

export default function WorkOrders() {
  const page = usePage<SharedData & { workOrders: PaginationResponse<WorkOrder> }>();
  const { message } = page.props.flash;
  const { workOrders } = page.props;
  const { delete: destroy, processing } = useForm();

  useEffect(() => {
    if (message) {
      toast(message);
    }
  }, [message]);

  const columns = useMemo<ColumnDef<WorkOrder>[]>(
    () => [
      {
        accessorKey: 'number',
        header: 'Number',
      },
      {
        accessorKey: 'product.name',
        header: 'Product',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        accessorKey: 'deadline',
        header: 'Deadline',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'operator.name',
        header: 'Operator',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
      },
      {
        id: 'actions',
        cell: (ctx) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/work-orders/${ctx.row.original.id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the work order and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => destroy(`/work-orders/${ctx.row.original.id}`)} disabled={processing}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [destroy, processing],
  );

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

        <div className="mt-6" />

        <DataTable columns={columns} data={workOrders.data} pageCount={workOrders.meta.last_page} rowCount={workOrders.meta.total} />

        <div className="mt-4 flex justify-end">
          <Pagination className="mx-[unset] w-[unset]">
            <PaginationContent>
              {workOrders.meta.links.map((link) => (
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
