import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: route('products.index'),
  },
  {
    title: 'Edit Product',
    href: '#',
  },
];

type Product = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export default function EditProduct({ product }: { product: Product }) {
  const { data, setData, patch, processing, errors } = useForm({
    name: product.name,
    description: product.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('products.update', product.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Product" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground text-sm">Update the details of the product below</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name <span className="text-red-600">*</span>
            </Label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name ? <p className="text-[0.8rem] text-red-600">{errors.name}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={data.description ?? ''} onChange={(e) => setData('description', e.target.value)} />
            {errors.description ? <p className="text-[0.8rem] text-red-600">{errors.description}</p> : null}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={route('products.index')} prefetch>
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
