import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
  {
    title: 'Add Progress Note',
    href: '/work-orders/add-progress-note',
  },
];

type WorkOrder = {
  id: number;
  number: string;
};

export default function AddProgressNote({ workOrder }: { workOrder: WorkOrder }) {
  const { data, setData, post, processing, errors } = useForm({
    progress_note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/work-orders/${workOrder.id}/store-progress`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Progress Note" />

      <div className="px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Add Progress Note</h2>
          <p className="text-muted-foreground text-sm">Add a progress note for the work order below</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="progress_note">Progress Note</Label>
            <Input id="progress_note" type="text" value={data.progress_note} onChange={(e) => setData('progress_note', e.target.value)} required />
            {errors.progress_note && <div className="text-red-600">{errors.progress_note}</div>}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/work-orders" prefetch>
                Cancel
              </Link>
            </Button>

            <Button type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding
                </>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
