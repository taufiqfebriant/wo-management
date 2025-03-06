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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DataTable } from '@/components/ui/data-table';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, PaginationResponse, SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { Check, ChevronsUpDown, Loader2, MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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
  roles: { id: number; name: string }[];
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

const statusOptions = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Canceled' },
];

export default function WorkOrders() {
  const page = usePage<
    SharedData & {
      workOrders: PaginationResponse<WorkOrder>;
      filters: { status?: number; start_deadline?: string; end_deadline?: string };
    }
  >();
  const { message } = page.props.flash;
  const { workOrders, filters, auth } = page.props;
  const { delete: destroy, processing } = useForm();

  const [statusOpen, setStatusOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(filters.start_deadline ? parseISO(filters.start_deadline) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(filters.end_deadline ? parseISO(filters.end_deadline) : undefined);
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(filters.status);

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
                {auth.user.permissions.find((permission) => permission.name === 'read work order') ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/work-orders/${ctx.row.original.id}`} prefetch>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {auth.user.permissions.find((permission) => permission.name === 'update work orders') ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/work-orders/${ctx.row.original.id}/edit`} prefetch>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {auth.user.permissions.find((permission) => permission.name === 'delete work orders') ? (
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
                          {processing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting
                            </>
                          ) : (
                            'Continue'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
                {auth.user.permissions.find((permission) => permission.name === 'update work order status') &&
                ctx.row.original.status !== 'Completed' ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/work-orders/${ctx.row.original.id}/update-status`} prefetch>
                      Update Status
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {auth.user.permissions.find((permission) => permission.name === 'create work order progress notes') &&
                ctx.row.original.status === 'In Progress' ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/work-orders/${ctx.row.original.id}/add-progress-note`} prefetch>
                      Add Progress Note
                    </Link>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [destroy, processing, auth.user.permissions],
  );

  const applyFilters = () => {
    const query = {
      status: selectedStatus,
      start_deadline: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
      end_deadline: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
    };
    router.get('/work-orders', query, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setSelectedStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);

    router.get('/work-orders', undefined, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Work Orders" />

      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Work Orders</h2>
            <p className="text-muted-foreground text-sm">Manage and track the status of work orders</p>
          </div>

          {auth.user.permissions.find((permission) => permission.name === 'create work orders') ? (
            <Button asChild>
              <Link href="/work-orders/create" prefetch>
                Create
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          <div className="flex space-x-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={statusOpen} className="w-full justify-between">
                    {statusOptions.find((option) => option.value === selectedStatus)?.label || 'Select status'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {statusOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value.toString()}
                            onSelect={(currentValue) => {
                              setSelectedStatus(Number(currentValue));
                              setStatusOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', selectedStatus === option.value ? 'opacity-100' : 'opacity-0')} />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start_deadline">Start Deadline</Label>
              <DateTimePicker
                hourCycle={24}
                value={startDate}
                onChange={(selectedDate) => {
                  setStartDate(selectedDate);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end_deadline">End Deadline</Label>
              <DateTimePicker
                hourCycle={24}
                value={endDate}
                onChange={(selectedDate) => {
                  setEndDate(selectedDate);
                }}
              />
            </div>
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-6" />

        <DataTable columns={columns} data={workOrders.data} />

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
                    prefetch
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
