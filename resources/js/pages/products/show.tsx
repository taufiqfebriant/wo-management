import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product, SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: route('products.index'),
  },
  {
    title: 'Detail',
    href: '#',
  },
];

type ProductProps = SharedData & {
  product: Product;
};

export default function Product(props: ProductProps) {
  const { message } = props.flash;

  useEffect(() => {
    if (message) {
      toast(message);
    }
  }, [message]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Product ${props.product.name}`} />

      <div className="space-y-8 px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
          <p className="text-muted-foreground text-sm">View the details of the product</p>
        </div>

        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{props.product.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="font-medium">{props.product.description || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Created At</p>
                <p className="font-medium">{format(parseISO(props.product.created_at), 'PPP')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Updated At</p>
                <p className="font-medium">{format(parseISO(props.product.updated_at), 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href={route('products.index')}>Back</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
