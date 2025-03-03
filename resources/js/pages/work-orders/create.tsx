import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
  {
    title: 'Create Work Order',
    href: '/work-orders/create',
  },
];

export default function CreateWorkOrder() {
  const { data, setData, post, processing, errors } = useForm({
    product_id: '',
    quantity: '',
    deadline: '',
    user_id: '',
  });

  const page = usePage<{ products: { id: number; name: string }[]; users: { id: number; name: string }[] }>();
  const { products, users } = page.props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/work-orders');
  };

  const [productOpen, setProductOpen] = React.useState(false);
  const [operatorOpen, setOperatorOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Work Order" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Create Work Order</h2>
          <p className="text-muted-foreground text-sm">Fill out the form below to create a new work order.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="product_id">Product</Label>
            <Popover open={productOpen} onOpenChange={setProductOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={productOpen} className="w-full justify-between">
                  {data.product_id ? products.find((product) => product.id === Number(data.product_id))?.name : 'Select product'}
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
                            setData('product_id', currentValue === data.product_id ? '' : currentValue);
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
            <Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} required />
            {errors.quantity && <div className="text-red-600">{errors.quantity}</div>}
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
                    setData('deadline', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.deadline && <div className="text-red-600">{errors.deadline}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user_id">Operator</Label>
            <Popover open={operatorOpen} onOpenChange={setOperatorOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={operatorOpen} className="w-full justify-between">
                  {data.user_id ? users.find((user) => user.id === Number(data.user_id))?.name : 'Select operator'}
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
                            setData('user_id', currentValue === data.user_id ? '' : currentValue);
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
              Create
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
