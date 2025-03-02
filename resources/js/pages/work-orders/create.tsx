import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

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
    product_name: '',
    quantity: '',
    deadline: '',
    operator: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/work-orders');
  };

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
            <Label htmlFor="product_name">Product Name</Label>
            <Input id="product_name" value={data.product_name} onChange={(e) => setData('product_name', e.target.value)} required />
            {errors.product_name && <div className="text-red-600">{errors.product_name}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} required />
            {errors.quantity && <div className="text-red-600">{errors.quantity}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} required />
            {errors.deadline && <div className="text-red-600">{errors.deadline}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="operator">Operator</Label>
            <Input id="operator" value={data.operator} onChange={(e) => setData('operator', e.target.value)} required />
            {errors.operator && <div className="text-red-600">{errors.operator}</div>}
          </div>

          <Button type="submit" disabled={processing}>
            Create
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
