import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn, statusOptions } from '@/lib/utils';
import type { BreadcrumbItem, SharedData, WorkOrderUpdate } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: route('work-orders.index'),
  },
  {
    title: 'Update Status',
    href: '#',
  },
];

type UpdateWorkOrderStatusProps = SharedData & {
  workOrderUpdate: WorkOrderUpdate;
};

export default function UpdateWorkOrderStatus(props: UpdateWorkOrderStatusProps) {
  const { data, setData, patch, processing, errors } = useForm({
    status: props.workOrderUpdate.new_status,
    quantity_processed: props.workOrderUpdate.quantity_processed,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('work-orders.update-status', props.workOrderUpdate.work_order?.id));
  };

  const [statusOpen, setStatusOpen] = React.useState(false);

  const filteredStatusOptions = statusOptions.filter((option) => {
    if (props.workOrderUpdate.new_status === 0) {
      return option.value === 1;
    } else if (props.workOrderUpdate.new_status === 1) {
      return option.value === 2;
    } else {
      return false;
    }
  });

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
            <Label htmlFor="status">
              Status <span className="text-red-600">*</span>
            </Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={statusOpen} className="w-full justify-between">
                  {filteredStatusOptions.find((option) => option.value === data.status)?.label || 'Select status'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      {filteredStatusOptions.map((option) => (
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
            {errors.status ? <p className="text-[0.8rem] text-red-600">{errors.status}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity_processed">
              Processed Quantity <span className="text-red-600">*</span>
            </Label>
            <Input
              id="quantity_processed"
              type="number"
              value={data.quantity_processed}
              onChange={(e) => setData('quantity_processed', Number(e.target.value))}
            />
            {errors.quantity_processed ? <p className="text-[0.8rem] text-red-600">{errors.quantity_processed}</p> : null}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={route('work-orders.index')}>Cancel</Link>
            </Button>

            <Button type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
