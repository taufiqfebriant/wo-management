import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
  {
    title: 'Update Status',
    href: '/work-orders/update-status',
  },
];

type WorkOrder = {
  id: number;
  number: string;
  quantity: number;
  status: string;
  work_order_updates: { quantity_processed: number }[];
};

const getStatusOptions = (currentStatus: string) => {
  if (currentStatus === 'Pending') {
    return [{ value: 1, label: 'In Progress' }];
  } else if (currentStatus === 'In Progress') {
    return [{ value: 2, label: 'Completed' }];
  }
  return [];
};

const statusOptions = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Canceled' },
];

const getStatusValue = (currentStatus: string) => {
  return statusOptions.find((option) => option.label === currentStatus)?.value || 0;
};

export default function UpdateStatus({ workOrder }: { workOrder: WorkOrder }) {
  const { data, setData, patch, processing, errors } = useForm({
    status: getStatusValue(workOrder.status),
    quantity_processed: workOrder.work_order_updates?.[0]?.quantity_processed ?? workOrder.quantity,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/work-orders/${workOrder.id}/update-status`);
  };

  const [statusOpen, setStatusOpen] = React.useState(false);
  const statusOptions = getStatusOptions(workOrder.status);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Status" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Update Status</h2>
          <p className="text-muted-foreground text-sm">Update the status and processed quantity of the work order</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="status">New Status</Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={statusOpen} className="w-full justify-between">
                  {statusOptions.find((option) => option.value === data.status)?.label || 'Select status'}
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
                            setData('status', Number(currentValue));
                            setStatusOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', data.status === option.value ? 'opacity-100' : 'opacity-0')} />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.status && <div className="text-red-600">{errors.status}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity_processed">Processed Quantity</Label>
            <Input
              id="quantity_processed"
              type="number"
              value={data.quantity_processed}
              onChange={(e) => setData('quantity_processed', Number(e.target.value))}
              min={1}
              max={workOrder.work_order_updates?.[0]?.quantity_processed ?? workOrder.quantity}
              required
            />
            {errors.quantity_processed && <div className="text-red-600">{errors.quantity_processed}</div>}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="/work-orders">Cancel</a>
            </Button>

            <Button type="submit" disabled={processing}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
