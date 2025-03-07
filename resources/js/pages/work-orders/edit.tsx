import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn, statusOptions } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: route('work-orders.index'),
  },
  {
    title: 'Edit Work Order',
    href: '#',
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

export default function EditWorkOrder({
  workOrder,
  products,
  users,
}: {
  workOrder: WorkOrder;
  products: { id: number; name: string }[];
  users: { id: number; name: string }[];
}) {
  const { data, setData, patch, processing, errors } = useForm({
    product_id: workOrder.product.id,
    quantity: workOrder.quantity,
    deadline: workOrder.deadline,
    status: statusOptions.find((option) => option.label === workOrder.status)?.value || 0,
    user_id: workOrder.operator.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('work-orders.update', workOrder.id));
  };

  const [productOpen, setProductOpen] = React.useState(false);
  const [operatorOpen, setOperatorOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [date24, setDate24] = React.useState<Date | undefined>(parseISO(workOrder.deadline));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Work Order" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Edit Work Order</h2>
          <p className="text-muted-foreground text-sm">Update the details of the work order below</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="product_id">
              Product <span className="text-red-600">*</span>
            </Label>
            <Popover open={productOpen} onOpenChange={setProductOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={productOpen} className="w-full justify-between">
                  {data.product_id ? products.find((product) => product.id === data.product_id)?.name : 'Select product'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search product..." />
                  <CommandList>
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup>
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.id.toString()}
                          onSelect={(currentValue) => {
                            setData('product_id', currentValue === String(data.product_id) ? 0 : Number(currentValue));
                            setProductOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', Number(data.product_id) === product.id ? 'opacity-100' : 'opacity-0')} />
                          {product.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.product_id ? <p className="text-[0.8rem] text-red-600">{errors.product_id}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">
              Quantity <span className="text-red-600">*</span>
            </Label>
            <Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', Number(e.target.value))} />
            {errors.quantity ? <p className="text-[0.8rem] text-red-600">{errors.quantity}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">
              Deadline <span className="text-red-600">*</span>
            </Label>
            <DateTimePicker
              hourCycle={24}
              value={date24}
              onChange={(selectedDate) => {
                setDate24(selectedDate);
                setData('deadline', selectedDate ? format(selectedDate, 'yyyy-MM-dd HH:mm:ss') : '');
              }}
              align="start"
            />
            {errors.deadline ? <p className="text-[0.8rem] text-red-600">{errors.deadline}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">
              Status <span className="text-red-600">*</span>
            </Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={statusOpen} className="w-full justify-between">
                  {statusOptions.find((option) => option.value === data.status)?.label || 'Select status'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0" align="start">
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
            {errors.status ? <p className="text-[0.8rem] text-red-600">{errors.status}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user_id">
              Operator <span className="text-red-600">*</span>
            </Label>
            <Popover open={operatorOpen} onOpenChange={setOperatorOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={operatorOpen} className="w-full justify-between">
                  {data.user_id ? users.find((user) => user.id === data.user_id)?.name : 'Select operator'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search operator..." />
                  <CommandList>
                    <CommandEmpty>No operator found.</CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id.toString()}
                          onSelect={(currentValue) => {
                            setData('user_id', currentValue === String(data.user_id) ? 0 : Number(currentValue));
                            setOperatorOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', Number(data.user_id) === user.id ? 'opacity-100' : 'opacity-0')} />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.user_id ? <p className="text-[0.8rem] text-red-600">{errors.user_id}</p> : null}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={route('work-orders.index')} prefetch>
                Cancel
              </Link>
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
