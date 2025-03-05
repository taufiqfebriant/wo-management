import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';

type Product = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Detail',
    href: '#',
  },
];

export default function ShowProduct({ product }: { product: Product }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Product ${product.name}`} />

      <div className="space-y-8 px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
          <p className="text-muted-foreground text-sm">View the details of the product</p>
        </div>

        {/* Product Details */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="font-medium">{product.description || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Created At</p>
                <p className="font-medium">{format(parseISO(product.created_at), 'PPP')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Updated At</p>
                <p className="font-medium">{format(parseISO(product.updated_at), 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href="/products">Back</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
