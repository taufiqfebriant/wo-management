import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginationResponse, Product, SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/products',
  },
];

export default function Products() {
  const page = usePage<SharedData & { products: PaginationResponse<Product> }>();
  const { message } = page.props.flash;
  const { products } = page.props;
  const { delete: destroy, processing } = useForm();

  useEffect(() => {
    if (message) {
      toast(message);
    }
  }, [message]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
      },
      {
        id: 'actions',
        cell: (ctx) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {page.props.auth.user.permissions.find((permission) => permission.name === 'read product') ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/products/${ctx.row.original.id}`} prefetch>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {page.props.auth.user.permissions.find((permission) => permission.name === 'update products') ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/products/${ctx.row.original.id}/edit`} prefetch>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {page.props.auth.user.permissions.find((permission) => permission.name === 'delete products') ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => destroy(`/products/${ctx.row.original.id}`)} disabled={processing}>
                          {processing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting
                            </>
                          ) : (
                            'Continue'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [destroy, processing, page.props.auth.user.permissions],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />

      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Products</h2>
            <p className="text-muted-foreground text-sm">Manage and track the products</p>
          </div>

          {page.props.auth.user.permissions.find((permission) => permission.name === 'create products') ? (
            <Button asChild>
              <Link href="/products/create" prefetch>
                Create
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-6" />

        <DataTable columns={columns} data={products.data} />

        <div className="mt-4 flex justify-end">
          <Pagination className="mx-[unset] w-[unset]">
            <PaginationContent>
              {products.meta.links.map((link) => (
                <PaginationItem key={link.label}>
                  <PaginationLink
                    href={link.url ?? '#'}
                    isActive={link.active}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    size={link.label.toLowerCase().includes('previous') || link.label.toLowerCase().includes('next') ? 'default' : 'icon'}
                    prefetch
                    {...(!link.url || link.active ? { as: 'button', disabled: true } : {})}
                  />
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </AppLayout>
  );
}
