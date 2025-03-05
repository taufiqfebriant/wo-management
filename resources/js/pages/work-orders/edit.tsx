import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
  {
    title: 'Edit Work Order',
    href: '/work-orders/edit',
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
    patch(`/work-orders/${workOrder.id}`);
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
            <Label htmlFor="product">Product</Label>
            <Popover open={productOpen} onOpenChange={setProductOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={productOpen} className="w-full justify-between">
                  {data.product_id ? products.find((product) => product.id === data.product_id)?.name : 'Select product'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
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
            {errors.product_id && <div className="text-red-600">{errors.product_id}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', Number(e.target.value))} required />
            {errors.quantity && <div className="text-red-600">{errors.quantity}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">Deadline</Label>
            <DateTimePicker
              hourCycle={24}
              value={date24}
              onChange={(selectedDate) => {
                setDate24(selectedDate);
                setData('deadline', selectedDate ? format(selectedDate, 'yyyy-MM-dd HH:mm:ss') : '');
              }}
            />
            {errors.deadline && <div className="text-red-600">{errors.deadline}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
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
            <Label htmlFor="operator">Operator</Label>
            <Popover open={operatorOpen} onOpenChange={setOperatorOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={operatorOpen} className="w-full justify-between">
                  {data.user_id ? users.find((user) => user.id === data.user_id)?.name : 'Select operator'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
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
            {errors.user_id && <div className="text-red-600">{errors.user_id}</div>}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/work-orders">Cancel</Link>
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
