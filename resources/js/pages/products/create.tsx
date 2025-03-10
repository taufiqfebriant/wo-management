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
    title: 'Create Product',
    href: route('products.create'),
  },
];

export default function CreateProduct() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Product" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Create Product</h2>
          <p className="text-muted-foreground text-sm">Fill out the form below to create a new product</p>
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
            <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            {errors.description ? <p className="text-[0.8rem] text-red-600">{errors.description}</p> : null}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={route('products.index')}>Cancel</Link>
            </Button>

            <Button type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
