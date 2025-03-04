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
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

const statusOptions = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Canceled' },
];

export default function WorkOrders() {
  const page = usePage<SharedData & { workOrders: PaginationResponse<WorkOrder>; filters: { status?: number; deadline?: string } }>();
  const { message } = page.props.flash;
  const { workOrders, filters } = page.props;
  const { delete: destroy, processing } = useForm();

  const [statusOpen, setStatusOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(filters.deadline ? new Date(filters.deadline) : undefined);

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

  const handleFilterChange = (key: string, value: string) => {
    const query = { ...filters, [key]: value };
    router.get('/work-orders', query, {
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

          <Button asChild>
            <Link href="/work-orders/create">Create</Link>
          </Button>
        </div>

        <div className="mt-6 flex space-x-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={statusOpen} className="w-full justify-between">
                  {statusOptions.find((option) => option.value === filters.status)?.label || 'Select status'}
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
                            handleFilterChange('status', currentValue);
                            setStatusOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', filters.status === option.value ? 'opacity-100' : 'opacity-0')} />
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
            <Label htmlFor="deadline">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    handleFilterChange('deadline', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
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
